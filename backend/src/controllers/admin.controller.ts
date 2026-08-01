import { Request, Response, NextFunction } from 'express'
import prisma from '@/utils/prisma'
import { interviewPrepService } from '@/services/interview-prep.service'

export class AdminController {
  async getQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const quizzes = await prisma.quiz.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true } },
          topic: { select: { id: true, title: true, slug: true } },
        },
      })
      res.json(quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        topic: q.topic,
        questionCount: q._count.questions,
        createdAt: q.createdAt,
      })))
    } catch (error) {
      next(error)
    }
  }

  async getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await prisma.quiz.findUnique({
        where: { id: req.params.id },
        include: {
          topic: { select: { id: true, title: true, slug: true } },
          questions: { orderBy: { order: 'asc' } },
        },
      })
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }

  async getInterviewTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = await interviewPrepService.getTopics()
      res.json(topics)
    } catch (error) {
      next(error)
    }
  }

  async getInterviewQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await interviewPrepService.getQuestionsBySlug(req.params.slug)
      if (!topic) return res.status(404).json({ message: 'Topic not found' })
      res.json(topic)
    } catch (error) {
      next(error)
    }
  }
}

export const adminController = new AdminController()
