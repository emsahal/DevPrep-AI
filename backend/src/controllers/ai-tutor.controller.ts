import { Response, NextFunction } from 'express'
import { aiTutorService } from '@/services/ai-tutor.service'
import type { AuthRequest } from '@/middleware/auth'
import type { PromptType } from '@/ai/prompts'

export class AITutorController {
  async chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { query, type = 'chat', context = '', sessionId } = req.body
      const result = await aiTutorService.generateResponse(
        req.userId!,
        query,
        type as PromptType,
        context,
        sessionId
      )
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async chatStream(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { query, type = 'chat', context = '', sessionId } = req.body

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')

      const sid = await aiTutorService.generateStreamingResponse(
        req.userId!,
        query,
        type as PromptType,
        context,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
        },
        sessionId
      )

      res.write(`data: ${JSON.stringify({ done: true, sessionId: sid })}\n\n`)
      res.end()
    } catch (error) {
      if (!res.headersSent) {
        next(error)
      }
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.query
      const history = await aiTutorService.getHistory(
        req.userId!,
        sessionId as string | undefined
      )
      res.json(history)
    } catch (error) {
      next(error)
    }
  }

  async clearHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.body
      await aiTutorService.clearHistory(req.userId!, sessionId)
      res.json({ message: 'History cleared' })
    } catch (error) {
      next(error)
    }
  }
}

export const aiTutorController = new AITutorController()
