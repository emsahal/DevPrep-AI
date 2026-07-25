import { Request, Response, NextFunction } from 'express'

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown'
    const now = Date.now()
    const record = requestCounts.get(key)

    if (!record || now > record.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      })
    }

    record.count++
    next()
  }
}
