import { Request, Response, NextFunction } from 'express'
import { learningPathService } from '@/services/learning-path.service'
import type { AuthRequest } from '@/middleware/auth'

export class LearningPathController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const paths = await learningPathService.getAll(req.userId)
      res.json(paths)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const path = await learningPathService.getBySlug(req.params.slug, req.userId)
      if (!path) {
        return res.status(404).json({ message: 'Learning path not found' })
      }
      res.json(path)
    } catch (error) {
      next(error)
    }
  }
}

export const learningPathController = new LearningPathController()
