import { Request, Response, NextFunction } from 'express'
import prisma from '@/utils/prisma'
import type { AuthRequest } from '@/middleware/auth'

export const ADMIN_EMAILS = ['sarcasticsahal@gmail.com']

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Access token required' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { email: true },
    })

    if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }

    next()
  } catch (error) {
    next(error)
  }
}
