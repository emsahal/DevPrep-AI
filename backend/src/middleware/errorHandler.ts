import { Request, Response, NextFunction } from 'express'
import logger from '@/utils/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    })
  }

  logger.error('Unhandled error:', err)

  return res.status(500).json({
    message: 'Internal server error',
    statusCode: 500,
  })
}

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({
    message: 'Resource not found',
    statusCode: 404,
  })
}
