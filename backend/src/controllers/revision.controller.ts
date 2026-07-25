import { Response, NextFunction } from 'express'
import { revisionService } from '@/services/revision.service'
import type { AuthRequest } from '@/middleware/auth'

export class RevisionController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.query
      const notes = await revisionService.getAll(req.userId!, type as string | undefined)
      res.json(notes)
    } catch (error) {
      next(error)
    }
  }

  async generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { topicId, type } = req.body
      const result = await revisionService.generate(req.userId!, topicId, type)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getTopics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const topics = await revisionService.getTopicsForRevision()
      res.json(topics)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await revisionService.delete(req.userId!, req.params.id)
      res.json({ message: 'Deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export const revisionController = new RevisionController()
