import { Request, Response, NextFunction } from 'express'
import { dsaCheckService } from '@/services/dsa-check.service'

export class DSACheckController {
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionTitle, questionProblem, questionExamples, code, language = 'cpp' } = req.body

      if (!questionTitle || !questionProblem || !code) {
        return res.status(400).json({ message: 'Missing required fields: questionTitle, questionProblem, code' })
      }

      const result = await dsaCheckService.checkSolution(
        questionTitle,
        questionProblem,
        questionExamples || [],
        code,
        language
      )

      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const dsaCheckController = new DSACheckController()
