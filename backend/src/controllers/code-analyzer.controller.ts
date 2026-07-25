import { Request, Response, NextFunction } from 'express'
import { codeAnalyzerService } from '@/services/code-analyzer.service'

export class CodeAnalyzerController {
  async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language = 'javascript' } = req.body
      const result = await codeAnalyzerService.analyze(code, language)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const codeAnalyzerController = new CodeAnalyzerController()
