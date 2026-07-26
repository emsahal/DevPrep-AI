import { Response, NextFunction } from 'express'
import { duelService } from '@/services/duel/duel.service'
import type { AuthRequest } from '@/middleware/auth'

export class DuelController {
  async requestMatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { toUserId, mode, topic } = req.body
      if (!mode || !topic) return res.status(400).json({ message: 'mode and topic are required' })

      const request = await duelService.requestMatch(req.userId!, toUserId || null, mode, topic)
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
}

export const duelController = new DuelController()
