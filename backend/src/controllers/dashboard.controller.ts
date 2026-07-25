import { Response, NextFunction } from 'express'
import { dashboardService } from '@/services/dashboard.service'
import type { AuthRequest } from '@/middleware/auth'

export class DashboardController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.userId!)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  async getRecentActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activity = await dashboardService.getRecentActivity(req.userId!)
      res.json(activity)
    } catch (error) {
      next(error)
    }
  }

  async getLearningProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const progress = await dashboardService.getLearningProgress(req.userId!)
      res.json(progress)
    } catch (error) {
      next(error)
    }
  }

  async getContinueLearning(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const topics = await dashboardService.getContinueLearning(req.userId!)
      res.json(topics)
    } catch (error) {
      next(error)
    }
  }
}

export const dashboardController = new DashboardController()
