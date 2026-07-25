import { Request, Response, NextFunction } from 'express'
import { interviewPrepService } from '@/services/interview-prep.service'

export class InterviewPrepController {
  async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = await interviewPrepService.getTopics()
      res.json(topics)
    } catch (error) {
      next(error)
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await interviewPrepService.getBySlug(req.params.slug)
      if (!topic) return res.status(404).json({ message: 'Topic not found' })
      res.json(topic)
    } catch (error) {
      next(error)
    }
  }
}

export const interviewPrepController = new InterviewPrepController()
