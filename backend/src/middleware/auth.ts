import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string; role: string }
    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired access token' })
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string; role: string }
    req.userId = decoded.userId
    req.userRole = decoded.role
  } catch {
    // ignore
  }
  next()
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }
    next()
  }
}
