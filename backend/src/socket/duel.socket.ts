import { Server, Socket, Namespace } from 'socket.io'
import jwt from 'jsonwebtoken'
import prisma from '@/utils/prisma'
import { config } from '@/config'
import { duelService } from '@/services/duel/duel.service'
import { matchmakingService } from '@/services/duel/matchmaking.service'
import { notificationService } from '@/services/notification.service'
import logger from '@/utils/logger'
import type { DuelGameContent } from '@/services/duel/duel-engine.interface'

interface AuthSocket extends Socket {
  userId?: string
}

const userSockets = new Map<string, Set<string>>()

function getUserSocketIds(userId: string): string[] {
  return Array.from(userSockets.get(userId) || [])
}

function emitToUser(ns: Namespace, userId: string, event: string, data: unknown) {
  for (const socketId of getUserSocketIds(userId)) {
    ns.to(socketId).emit(event, data)
  }
}

async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, avatar: true },
  })
  return user || { id: userId, name: 'Unknown', avatar: null }
}

export function setupDuelSocket(io: Server) {
  const duelNs = io.of('/duels')

  duelNs.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token
    if (!token) return next(new Error('Authentication required'))

    try {
      const decoded = jwt.verify(token as string, config.jwt.accessSecret) as { userId: string }
      socket.userId = decoded.userId
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  duelNs.on('connection', (socket: AuthSocket) => {
    const userId = socket.userId!
    logger.info(`Duel WS connected: user=${userId} socket=${socket.id}`)

    if (!userSockets.has(userId)) userSockets.set(userId, new Set())
    userSockets.get(userId)!.add(socket.id)

    socket.on('duel:set_available', async ({ mode, topic }) => {
      await matchmakingService.setAvailable(userId, mode, topic)
    })

    socket.on('duel:set_unavailable', async ({ mode, topic }) => {
      if (mode && topic) {
        await matchmakingService.setUnavailable(userId, mode, topic)
      } else {
        await matchmakingService.removeFromAll(userId)
      }
    })

    socket.on('duel:request_match', async ({ mode, topic }) => {
      try {
        const opponentId = await matchmakingService.findOpponent(userId, mode, topic)
        if (!opponentId) {
          socket.emit('duel:searching', { mode, topic, elapsed: 0 })
          return
        }

        const request = await duelService.requestMatch(userId, opponentId, mode, topic)
        emitToUser(duelNs, opponentId, 'duel:request_received', {
          matchRequestId: request.id,
          fromUser: request.fromUser,
          mode: request.mode,
          topic: request.topic,
          expiresAt: request.expiresAt,
        })
        socket.emit('duel:searching', { mode, topic, elapsed: 0 })

        setTimeout(async () => {
          const req = await prisma.matchRequest.findUnique({ where: { id: request.id } })
          if (req?.status === 'pending') {
            await duelService.expireRequest(request.id)
            emitToUser(duelNs, userId, 'duel:request_declined', { matchRequestId: request.id, reason: 'expired' })
            emitToUser(duelNs, opponentId, 'duel:request_declined', { matchRequestId: request.id, reason: 'expired' })
          }
        }, 20_000)
      } catch (error: unknown) {
        socket.emit('duel:error', { message: error instanceof Error ? error.message : 'Match request failed' })
      }
    })

    socket.on('duel:accept', async ({ matchRequestId }) => {
      try {
        const duel = await duelService.acceptRequest(matchRequestId, userId)

        const notif = await notificationService.create(
          duel.player1Id, 'duel_accepted', 'Duel Accepted!',
          `Your ${duel.mode} battle is starting!`,
          { duelId: duel.id },
        )
        emitToUser(duelNs, duel.player1Id, 'notification:new', notif)
        emitToUser(duelNs, duel.player1Id, 'duel:match_found', {
          duelId: duel.id,
          opponent: await getUserInfo(duel.player2Id),
          mode: duel.mode,
          topic: duel.topic,
        })
        emitToUser(duelNs, duel.player2Id, 'duel:match_found', {
          duelId: duel.id,
          opponent: await getUserInfo(duel.player1Id),
          mode: duel.mode,
          topic: duel.topic,
        })

        const content = duel.content as unknown as DuelGameContent
        socket.emit('duel:starting', {
          duelId: duel.id,
          mode: duel.mode,
          topic: duel.topic,
          content,
          timeLimit: content.timeLimit || 180,
          startedAt: duel.startedAt,
        })
      } catch (error: unknown) {
        socket.emit('duel:error', { message: error instanceof Error ? error.message : 'Failed to accept' })
      }
    })

    socket.on('duel:decline', async ({ matchRequestId }) => {
      try {
        const request = await duelService.declineRequest(matchRequestId, userId)
        emitToUser(duelNs, request.fromUserId, 'duel:request_declined', { matchRequestId, reason: 'declined' })
      } catch (error: unknown) {
        socket.emit('duel:error', { message: error instanceof Error ? error.message : 'Failed to decline' })
      }
    })

    socket.on('duel:submit_answer', async ({ duelId, questionId, answer, timestamp }) => {
      try {
        await duelService.submitAnswer(duelId, userId, questionId, answer, timestamp)
        const duel = await prisma.duel.findUnique({ where: { id: duelId } })
        if (!duel) return

        const answers = (duel.answers as Record<string, unknown[]>) || {}
        const playerAnswers = answers[userId] || []
        const totalQs = ((duel.content as unknown as DuelGameContent)?.questions?.length) || 0
        const opponentId = duel.player1Id === userId ? duel.player2Id : duel.player1Id

        emitToUser(duelNs, opponentId, 'duel:opponent_progress', {
          duelId,
          playerId: userId,
          questionsAnswered: playerAnswers.length,
          totalQuestions: totalQs,
          lastAnswerAt: new Date().toISOString(),
        })
      } catch (error: unknown) {
        socket.emit('duel:error', { message: error instanceof Error ? error.message : 'Failed to submit' })
      }
    })

    socket.on('duel:finished_early', async ({ duelId }) => {
      try {
        const result = await duelService.finishDuel(duelId, userId)
        const notificationData = {
          duelId: result.id,
          winnerId: result.winnerId,
          score1: result.score1,
          score2: result.score2,
          breakdown: (result as Record<string, unknown>).breakdown,
        }

        emitToUser(duelNs, result.player1Id, 'duel:result', { ...notificationData, xpEarned: result.winnerId === result.player1Id ? 50 : 20 })
        emitToUser(duelNs, result.player2Id, 'duel:result', { ...notificationData, xpEarned: result.winnerId === result.player2Id ? 50 : 20 })

        for (const pid of [result.player1Id, result.player2Id]) {
          const n = await notificationService.create(
            pid, 'duel_result',
            result.winnerId === pid ? 'You Won!' : 'Duel Complete',
            result.winnerId === pid ? 'Great job! You won the duel!' : 'You gave it your best shot!',
            notificationData,
          )
          emitToUser(duelNs, pid, 'notification:new', n)
        }
      } catch (error: unknown) {
        socket.emit('duel:error', { message: error instanceof Error ? error.message : 'Failed to finish' })
      }
    })

    socket.on('disconnect', async () => {
      logger.info(`Duel WS disconnected: user=${userId} socket=${socket.id}`)
      const sockets = userSockets.get(userId)
      if (sockets) {
        sockets.delete(socket.id)
        if (sockets.size === 0) {
          userSockets.delete(userId)
          await matchmakingService.removeFromAll(userId)
        }
      }
    })
  })
}
