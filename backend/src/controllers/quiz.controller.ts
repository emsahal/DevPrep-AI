import { Request, Response, NextFunction } from 'express'
import prisma from '@/utils/prisma'
import { quizService } from '@/services/quiz.service'
import { gamificationService } from '@/services/gamification.service'
import type { AuthRequest } from '@/middleware/auth'

export class QuizController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const topicId = req.query.topicId as string | undefined
      const quizzes = await quizService.getAll({ page, limit, topicId })
      res.json(quizzes)
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await quizService.getById(req.params.id)
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }

  async getDaily(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quiz = await quizService.getDailyQuiz()
      if (!quiz) return res.status(404).json({ message: 'No quiz available' })
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }

  async submitAttempt(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { answers } = req.body
      const quiz = await prisma.quiz.findUnique({ where: { id }, select: { difficulty: true } })
      const difficulty = quiz?.difficulty || 'beginner'
      const result = await quizService.submitAttempt(req.userId!, id, answers)
      gamificationService.handleQuizCompleted(req.userId!, id, result.score, difficulty).catch(() => {})
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getAttempts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const quizId = req.query.quizId as string | undefined
      const attempts = await quizService.getAttempts(req.userId!, { quizId, page, limit })
      res.json(attempts)
    } catch (error) {
      next(error)
    }
  }

  async generateAIQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { topicId, customTopic, questionCount = 15, difficulty = 'mixed', quizType = 'custom' } = req.body
      const count = Math.min(Math.max(parseInt(String(questionCount), 10) || 15, 15), 40)
      if (!customTopic && !topicId) return res.status(400).json({ message: 'topicId or customTopic is required' })
      const quiz = customTopic
        ? await quizService.generateCustomAIQuiz(String(customTopic), count, difficulty, quizType)
        : await quizService.generateAIQuiz(topicId, count, difficulty)
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }
}

export const quizController = new QuizController()
