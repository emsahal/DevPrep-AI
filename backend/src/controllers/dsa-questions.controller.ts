import { Request, Response, NextFunction } from 'express'
import { dsaQuestionsService } from '@/services/dsa-questions.service'

export class DSAQuestionsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { level, topic, search } = req.query

      if (search) {
        const results = dsaQuestionsService.getSearchSuggestions(search as string)
        return res.json({ data: results })
      }

      if (level) {
        const results = dsaQuestionsService.getByLevel(Number(level))
        return res.json({ data: results })
      }

      if (topic) {
        const results = dsaQuestionsService.getByTopic(topic as string)
        return res.json({ data: results })
      }

      const questions = dsaQuestionsService.getAll()
      res.json({ data: questions })
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const question = dsaQuestionsService.getById(id)

      if (!question) {
        return res.status(404).json({ message: 'Question not found' })
      }

      res.json({ data: question })
    } catch (error) {
      next(error)
    }
  }

  async getLevels(_req: Request, res: Response, next: NextFunction) {
    try {
      const levels = dsaQuestionsService.getLevels()
      res.json({ data: levels })
    } catch (error) {
      next(error)
    }
  }
}

export const dsaQuestionsController = new DSAQuestionsController()
