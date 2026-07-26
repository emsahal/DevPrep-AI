import { type Response, type NextFunction } from 'express'
import { duelService } from '@/services/duel/duel.service'
import { codeExecutionService } from '@/services/code-execution.service'
import { notificationService } from '@/services/notification.service'
import { io } from '@/app'
import type { AuthRequest } from '@/middleware/auth'
import prisma from '@/utils/prisma'

export class DuelController {
  async requestMatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { toUserId, mode, topic } = req.body
      if (!mode || !topic) return res.status(400).json({ message: 'mode and topic are required' })
      const request = await duelService.requestMatch(req.userId!, toUserId || null, mode, topic)

      // Emit real-time socket event to the opponent if they are connected
      const duelNs = io.of('/duels')
      duelNs.emit(`duel:request_received:${request.toUserId}`, {
        matchRequestId: request.id,
        fromUser: request.fromUser,
        mode: request.mode,
        topic: request.topic,
        expiresAt: request.expiresAt,
      })

      // Always persist a DB notification so offline users see it on next login
      if (toUserId) {
        const challenger = await prisma.user.findUnique({
          where: { id: req.userId! },
          select: { name: true },
        })
        const notif = await notificationService.create(
          toUserId,
          'duel_challenge',
          "You've been challenged!",
          `${challenger?.name ?? 'Someone'} challenged you to a ${mode} duel on ${topic}`,
          { matchRequestId: request.id, fromUserId: req.userId!, mode, topic },
        )
        // Also emit notification event
        duelNs.emit(`notification:new:${toUserId}`, notif)
      }

      res.status(201).json(request)
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
}

export const duelController = new DuelController()
