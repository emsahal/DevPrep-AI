import { Request, Response, NextFunction } from 'express'
import prisma from '@/utils/prisma'
import type { AuthRequest } from '@/middleware/auth'

export class ReviewController {
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await prisma.review.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
      res.json(reviews)
    } catch (error) {
      next(error)
    }
  }

  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, role, rating, text } = req.body
      if (!name || !text || typeof rating !== 'number') {
        res.status(400).json({ error: 'Name, rating, and text are required fields.' })
        return
      }

      const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

      const review = await prisma.review.create({
        data: {
          userId: req.userId,
          name: name.trim(),
          role: role?.trim() || 'Software Engineer',
          rating,
          text: text.trim(),
          initials: initials || 'US',
        },
      })

      res.status(201).json(review)
    } catch (error) {
      next(error)
    }
  }
}

export const reviewController = new ReviewController()
