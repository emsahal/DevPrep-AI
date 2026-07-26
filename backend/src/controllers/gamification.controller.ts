import { Request, Response, NextFunction } from 'express'
import { gamificationService } from '@/services/gamification.service'
import type { AuthRequest } from '@/middleware/auth'

export class GamificationController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await gamificationService.getStats(req.userId!)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as 'global' | 'weekly' | 'topic') || 'global'
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100)
      const topicId = req.query.topicId as string | undefined
      const userId = (req as AuthRequest).userId

      const result = await gamificationService.getLeaderboard(type, page, limit, topicId)

      let currentUser = null
      if (userId && type !== 'topic') {
        currentUser = await gamificationService.getCurrentUserRank(userId, type)
      }

      res.json({ ...result, currentUser })
    } catch (error) {
      next(error)
    }
  }

  async getBadges(_req: Request, res: Response, next: NextFunction) {
    try {
      const badges = await gamificationService.getAllBadges()
      res.json(badges)
    } catch (error) {
      next(error)
    }
  }

  async getUserBadges(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const badges = await gamificationService.getUserBadges(req.userId!)
      res.json(badges.map(ub => ({
        key: ub.badge.key,
        name: ub.badge.name,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        unlockedAt: ub.unlockedAt,
      })))
    } catch (error) {
      next(error)
    }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const result = await gamificationService.getTransactions(req.userId!, page, limit)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const gamificationController = new GamificationController()
