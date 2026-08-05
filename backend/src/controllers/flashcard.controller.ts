import { Response, NextFunction } from 'express'
import { flashcardService } from '@/services/flashcard.service'
import { gamificationService } from '@/services/gamification.service'
import type { AuthRequest } from '@/middleware/auth'

export class FlashcardController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const topicId = req.query.topicId as string | undefined
      const cards = await flashcardService.getAll({ page, limit, topicId })
      res.json(cards)
    } catch (error) {
      next(error)
    }
  }

  async getDueCards(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cards = await flashcardService.getDueCards(req.userId!)
      res.json(cards)
    } catch (error) {
      next(error)
    }
  }

  async updateCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { quality } = req.body
      const progress = await flashcardService.updateCard(req.userId!, id, quality)
      if (!progress) return res.status(404).json({ message: 'Flashcard not found' })
      gamificationService.handleFlashcardReviewed(req.userId!, id, progress.status).catch(() => {})
      res.json(progress)
    } catch (error) {
      next(error)
    }
  }

  async getSaved(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cards = await flashcardService.getSaved(req.userId!)
      res.json(cards)
    } catch (error) {
      next(error)
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await flashcardService.getStats(req.userId!)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  async generateForTopic(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params
      const result = await flashcardService.generateForTopic(slug)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const flashcardController = new FlashcardController()
