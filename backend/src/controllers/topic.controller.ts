import { Request, Response, NextFunction } from 'express'
import { topicService } from '@/services/topic.service'
import { gamificationService } from '@/services/gamification.service'
import type { AuthRequest } from '@/middleware/auth'

export class TopicController {
  async getBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const topic = await topicService.getBySlug(req.params.slug, req.userId)
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' })
      }
      res.json(topic)
    } catch (error) {
      next(error)
    }
  }

  async updateProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { topicId, completed, difficulty } = req.body
      const progress = await topicService.updateProgress(req.userId!, topicId, completed)
      if (!progress) {
        return res.status(404).json({ message: 'Topic not found' })
      }
      if (completed) {
        gamificationService.handleTopicCompleted(req.userId!, topicId, difficulty || 'beginner').catch(() => {})
      }
      res.json(progress)
    } catch (error) {
      next(error)
    }
  }
}

export const topicController = new TopicController()
