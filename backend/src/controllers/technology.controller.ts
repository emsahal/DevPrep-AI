import { Response, NextFunction } from 'express'
import { technologyService } from '@/services/technology.service'
import type { AuthRequest } from '@/middleware/auth'

export class TechnologyController {
  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await technologyService.getAll()
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const technology = await technologyService.getBySlug(req.params.slug, req.userId)
      if (!technology) {
        return res.status(404).json({ message: 'Technology not found' })
      }
      res.json(technology)
    } catch (error) {
      next(error)
    }
  }
}

export const technologyController = new TechnologyController()
