import { type Response, type NextFunction } from 'express'
import { duelService } from '@/services/duel/duel.service'
import { codeExecutionService } from '@/services/code-execution.service'
import { notificationService } from '@/services/notification.service'
import type { AuthRequest } from '@/middleware/auth'
import prisma from '@/utils/prisma'

export class DuelController {
  async getActiveUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const users = await prisma.user.findMany({
        where: { id: { not: userId } },
        select: { id: true, name: true, avatar: true },
        take: 20,
      })
      res.json(users.map(u => ({
        userId: u.id,
        name: u.name,
        avatar: u.avatar,
        mode: null,
        topic: null,
      })))
    } catch (error) {
      next(error)
    }
  }

  async getPendingRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const requests = await prisma.matchRequest.findMany({
        where: {
          toUserId: userId,
          status: 'pending',
          expiresAt: { gt: new Date() },
        },
        include: {
          fromUser: { select: { id: true, name: true, avatar: true } },
        },
      })
      res.json(requests.map(r => ({
        matchRequestId: r.id,
        fromUser: r.fromUser,
        mode: r.mode,
        topic: r.topic,
        expiresAt: r.expiresAt,
      })))
    } catch (error) {
      next(error)
    }
  }

  async getRequestStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const request = await prisma.matchRequest.findUnique({
        where: { id },
        include: {
          duel: { select: { id: true } },
        },
      })
      if (!request) return res.status(404).json({ message: 'Request not found' })
      res.json(request)
    } catch (error) {
      next(error)
    }
  }

  async requestMatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { toUserId, mode, topic } = req.body
      if (!mode || !topic) return res.status(400).json({ message: 'mode and topic are required' })

      const userId = req.userId!
      let request

      if (!toUserId) {
        // Set ourselves as available in matchmaking first
        const matchmakingService = (await import('@/services/duel/matchmaking.service')).matchmakingService
        await matchmakingService.setAvailable(userId, mode, topic)
        const opponentId = await matchmakingService.findOpponent(userId, mode, topic)

        if (opponentId) {
          // Found opponent! Pair them up.
          request = await duelService.requestMatch(userId, opponentId, mode, topic)
          const duel = await duelService.acceptRequest(request.id, opponentId)

          // Clean up availability
          await matchmakingService.removeFromAll(userId)
          await matchmakingService.removeFromAll(opponentId)

          return res.status(201).json({ ...request, status: 'accepted', duelId: duel.id })
        } else {
          // No opponent yet, return request in pending status
          request = await duelService.requestMatch(userId, null, mode, topic)
          return res.status(201).json(request)
        }
      } else {
        // Direct challenge to a user
        request = await duelService.requestMatch(userId, toUserId, mode, topic)

        const challenger = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        })
        await notificationService.create(
          toUserId,
          'duel_challenge',
          "You've been challenged!",
          `${challenger?.name ?? 'Someone'} challenged you to a ${mode} duel on ${topic}`,
          { matchRequestId: request.id, fromUserId: userId, mode, topic },
        )

        return res.status(201).json(request)
      }
    } catch (error) {
      next(error)
    }
  }

  async acceptRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const duel = await duelService.acceptRequest(req.params.id, req.userId!)
      res.json(duel)
    } catch (error) {
      next(error)
    }
  }

  async declineRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = await duelService.declineRequest(req.params.id, req.userId!)
      res.json(request)
    } catch (error) {
      next(error)
    }
  }

  async cancelRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await duelService.cancelRequest(req.params.id, req.userId!)
      res.json({ message: 'Request cancelled' })
    } catch (error) {
      next(error)
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const result = await duelService.getDuelHistory(req.userId!, page, limit)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async runCode(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { language, code, testCases } = req.body
      if (!language || !code || !testCases) {
        return res.status(400).json({ error: 'language, code, and testCases are required' })
      }
      const result = await codeExecutionService.executeCode({ language, code, testCases })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getDuel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const duelId = req.params.id
      const userId = req.userId!
      const duel = await prisma.duel.findUnique({
        where: { id: duelId },
        include: {
          player1: { select: { id: true, name: true, avatar: true } },
          player2: { select: { id: true, name: true, avatar: true } },
        }
      })
      if (!duel) return res.status(404).json({ message: 'Duel not found' })

      const opponent = duel.player1Id === userId ? duel.player2 : duel.player1
      const opponentId = duel.player1Id === userId ? duel.player2Id : duel.player1Id

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const answers = (duel.answers as Record<string, any[]>) || {}
      const myAnswers = answers[userId] || []
      const opponentAnswers = answers[opponentId] || []

      res.json({
        id: duel.id,
        status: duel.status,
        mode: duel.mode,
        topic: duel.topic,
        content: duel.content,
        startedAt: duel.startedAt,
        endedAt: duel.endedAt,
        winnerId: duel.winnerId,
        score1: duel.score1,
        score2: duel.score2,
        player1Id: duel.player1Id,
        player2Id: duel.player2Id,
        opponent,
        myProgress: {
          questionsAnswered: myAnswers.length,
        },
        opponentProgress: {
          questionsAnswered: opponentAnswers.length,
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async submitAnswer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const duelId = req.params.id
      const userId = req.userId!
      const { questionId, answer } = req.body
      if (!questionId) return res.status(400).json({ message: 'questionId is required' })

      await duelService.submitAnswer(duelId, userId, questionId, answer, Date.now())
      res.json({ message: 'Answer submitted successfully', status: 'ok' })
    } catch (error) {
      next(error)
    }
  }

  async finishDuel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const duelId = req.params.id
      const userId = req.userId!
      const result = await duelService.finishDuel(duelId, userId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const duelController = new DuelController()
