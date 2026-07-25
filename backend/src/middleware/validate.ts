import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source])
      req[source] = data
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce((acc: Record<string, string[]>, curr) => {
          const path = curr.path.join('.')
          if (!acc[path]) acc[path] = []
          acc[path].push(curr.message)
          return acc
        }, {})
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        })
      }
      next(error)
    }
  }
}
