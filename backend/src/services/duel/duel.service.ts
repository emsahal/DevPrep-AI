import prisma from '@/utils/prisma'
import { redis } from '@/utils/redis'
import { AppError } from '@/middleware/errorHandler'
import { quizBattleEngine } from './engines/quiz-battle.engine'
import { flashcardSprintEngine } from './engines/flashcard-sprint.engine'
import { codingBattleEngine } from './engines/coding-battle.engine'
import { matchmakingService } from './matchmaking.service'
import type { DuelEngine, DuelGameContent, PlayerSubmission } from './duel-engine.interface'

const ACTIVE_DUEL_PREFIX = 'duel:active:'

const engines: Record<string, DuelEngine> = {
  quiz: quizBattleEngine,
  flashcard: flashcardSprintEngine,
  coding: codingBattleEngine,
}

export class DuelService {
  getEngine(mode: string): DuelEngine {
    const engine = engines[mode]
    if (!engine) throw new AppError(400, `Unknown duel mode: ${mode}`)
    return engine
  }

  async requestMatch(fromUserId: string, toUserId: string | null, mode: string, topic: string) {
    if (await matchmakingService.isOnCooldown(fromUserId)) {
      throw new AppError(429, 'You are on cooldown. Please wait before requesting another match.')
    }

    const existing = await prisma.matchRequest.findFirst({
      where: {
        fromUserId,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
    })
    if (existing) throw new AppError(400, 'You already have a pending match request')

    const expiresAt = new Date(Date.now() + 20_000)

    const request = await prisma.matchRequest.create({
      data: {
        fromUserId,
        toUserId,
        mode,
        topic,
        expiresAt,
      },
      include: {
        fromUser: { select: { id: true, name: true, avatar: true } },
        toUser: { select: { id: true, name: true, avatar: true } },
      },
    })

    return request
  }

  async acceptRequest(requestId: string, userId: string) {
    const request = await prisma.matchRequest.findUnique({
      where: { id: requestId },
      include: {
        fromUser: { select: { id: true, name: true, avatar: true } },
      },
    })

    if (!request) throw new AppError(404, 'Match request not found')
    if (request.status !== 'pending') throw new AppError(400, 'Match request is no longer pending')
    if (request.toUserId && request.toUserId !== userId) throw new AppError(403, 'This request was not sent to you')
    if (request.expiresAt < new Date()) throw new AppError(400, 'Match request has expired')

    const engine = this.getEngine(request.mode)
    const content = await engine.generate(request.mode, request.topic)

    const duel = await prisma.$transaction(async (tx) => {
      await tx.matchRequest.update({
        where: { id: requestId },
        data: { status: 'accepted', respondedAt: new Date() },
      })

      return tx.duel.create({
        data: {
          matchRequestId: requestId,
          mode: request.mode,
          topic: request.topic,
          player1Id: request.fromUserId,
          player2Id: userId,
          content: JSON.parse(JSON.stringify(content)),
        },
      })
    })

    if (redis) {
      await redis.setex(
        `${ACTIVE_DUEL_PREFIX}${duel.id}`,
        7200,
        JSON.stringify({ duelId: duel.id, mode: duel.mode, player1Id: duel.player1Id, player2Id: duel.player2Id, content }),
      )
    }

    await matchmakingService.removeFromAll(request.fromUserId)
    await matchmakingService.removeFromAll(userId)

    return duel
  }

  async declineRequest(requestId: string, userId: string) {
    const request = await prisma.matchRequest.findUnique({ where: { id: requestId } })
    if (!request) throw new AppError(404, 'Match request not found')
    if (request.status !== 'pending') throw new AppError(400, 'Match request is no longer pending')

    await prisma.matchRequest.update({
      where: { id: requestId },
      data: { status: 'declined', respondedAt: new Date() },
    })

    await matchmakingService.recordDecline(userId)

    return request
  }

  async expireRequest(requestId: string) {
    await prisma.matchRequest.update({
      where: { id: requestId },
      data: { status: 'expired' },
    })
  }

  async cancelRequest(requestId: string, userId: string) {
    const request = await prisma.matchRequest.findUnique({ where: { id: requestId } })
    if (!request) throw new AppError(404, 'Match request not found')
    if (request.fromUserId !== userId) throw new AppError(403, 'Not your request')
    if (request.status !== 'pending') throw new AppError(400, 'Request already responded to')

    await prisma.matchRequest.update({
      where: { id: requestId },
      data: { status: 'cancelled' },
    })
  }

  async submitAnswer(duelId: string, userId: string, questionId: string, answer: unknown, timestamp: number) {
    const duel = await prisma.duel.findUnique({ where: { id: duelId } })
    if (!duel) throw new AppError(404, 'Duel not found')
    if (duel.status !== 'in_progress') throw new AppError(400, 'Duel is not in progress')
    if (duel.player1Id !== userId && duel.player2Id !== userId) throw new AppError(403, 'Not your duel')

    const existingAnswers = (duel.answers as Record<string, { questionId: string; answer: unknown; timestamp: number }[]>) || {}
    const playerKey = userId

    const playerAnswers = existingAnswers[playerKey] || []
    const existingIndex = playerAnswers.findIndex(a => a.questionId === questionId)
    if (existingIndex >= 0) return duel

    playerAnswers.push({ questionId, answer, timestamp })
    existingAnswers[playerKey] = playerAnswers

    await prisma.duel.update({
      where: { id: duelId },
      data: { answers: JSON.parse(JSON.stringify(existingAnswers)) },
    })

    if (redis) {
      const cached = await redis.get(`${ACTIVE_DUEL_PREFIX}${duelId}`)
      if (cached) {
        const data = JSON.parse(cached)
        data.answers = existingAnswers
        await redis.setex(`${ACTIVE_DUEL_PREFIX}${duelId}`, 7200, JSON.stringify(data))
      }
    }

    return duel
  }

  async finishDuel(duelId: string, userId: string) {
    const duel = await prisma.duel.findUnique({ where: { id: duelId } })
    if (!duel) throw new AppError(404, 'Duel not found')
    if (duel.status !== 'in_progress') throw new AppError(400, 'Duel already finished')

    const answers = (duel.answers as Record<string, { questionId: string; answer: unknown; timestamp: number }[]>) || {}
    const engine = this.getEngine(duel.mode)
    const content = duel.content as unknown as DuelGameContent

    const p1Answers = answers[duel.player1Id] || []
    const p2Answers = answers[duel.player2Id] || []

    const startedAt = duel.startedAt.getTime()
    const now = Date.now()

    const p1Submission: PlayerSubmission = {
      userId: duel.player1Id,
      answers: p1Answers,
      totalTimeMs: now - startedAt,
    }

    const p2Submission: PlayerSubmission = {
      userId: duel.player2Id,
      answers: p2Answers,
      totalTimeMs: now - startedAt,
    }

    const p1Result = engine.score(content, p1Submission)
    const p2Result = engine.score(content, p2Submission)
    const { winnerId, score1, score2 } = engine.determineWinner(
      { userId: duel.player1Id, ...p1Result },
      { userId: duel.player2Id, ...p2Result },
    )

    const updated = await prisma.duel.update({
      where: { id: duelId },
      data: {
        status: 'completed',
        score1,
        score2,
        winnerId,
        endedAt: new Date(),
      },
    })

    if (redis) {
      await redis.del(`${ACTIVE_DUEL_PREFIX}${duelId}`)
    }

    return {
      ...updated,
      breakdown: {
        player1: p1Result.breakdown,
        player2: p2Result.breakdown,
      },
    }
  }

  async forfeitDuel(duelId: string, loserId: string) {
    const duel = await prisma.duel.findUnique({ where: { id: duelId } })
    if (!duel) throw new AppError(404, 'Duel not found')
    if (duel.status !== 'in_progress') throw new AppError(400, 'Duel already finished')

    const winnerId = duel.player1Id === loserId ? duel.player2Id : duel.player1Id

    const updated = await prisma.duel.update({
      where: { id: duelId },
      data: { status: 'forfeited', winnerId, endedAt: new Date() },
    })

    if (redis) {
      await redis.del(`${ACTIVE_DUEL_PREFIX}${duelId}`)
    }

    return updated
  }

  async getDuelHistory(userId: string, page = 1, limit = 20) {
    const where = {
      OR: [{ player1Id: userId }, { player2Id: userId }],
    }

    const [data, total] = await Promise.all([
      prisma.duel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          player1: { select: { id: true, name: true, avatar: true } },
          player2: { select: { id: true, name: true, avatar: true } },
        },
      }),
      prisma.duel.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }
}

export const duelService = new DuelService()
