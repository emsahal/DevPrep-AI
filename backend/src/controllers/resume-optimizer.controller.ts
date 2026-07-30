import { Response, NextFunction } from 'express'
import { resumeOptimizerService } from '@/services/resume-optimizer.service'
import type { AuthRequest } from '@/middleware/auth'

export class ResumeOptimizerController {
  async getCredits(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const credits = await resumeOptimizerService.getCredits(req.userId!)
      res.json(credits)
    } catch (error) { next(error) }
  }

  async purchaseCredits(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body
      await resumeOptimizerService.purchaseCredits(req.userId!, amount)
      res.json({ message: 'Credits purchased. Payment integration pending.' })
    } catch (error) { next(error) }
  }

  async uploadResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }
      const result = await resumeOptimizerService.uploadAndParseResume(
        req.userId!,
        req.file.path,
        req.file.originalname
      )
      res.json(result)
    } catch (error) { next(error) }
  }

  async analyzeJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { resumeId, jobDescription } = req.body
      if (!resumeId || !jobDescription) {
        return res.status(400).json({ message: 'resumeId and jobDescription are required' })
      }
      const result = await resumeOptimizerService.analyzeJobDescription(resumeId, jobDescription)
      res.json(result)
    } catch (error) { next(error) }
  }

  async optimizeResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { resumeId } = req.body
      if (!resumeId) {
        return res.status(400).json({ message: 'resumeId is required' })
      }
      const result = await resumeOptimizerService.optimizeResume(resumeId)
      res.json(result)
    } catch (error) { next(error) }
  }

  async generateCoverLetter(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { resumeId, companyName, jobTitle } = req.body
      if (!resumeId) {
        return res.status(400).json({ message: 'resumeId is required' })
      }
      const result = await resumeOptimizerService.generateCoverLetter(resumeId, companyName, jobTitle)
      res.json(result)
    } catch (error) { next(error) }
  }

  async getResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await resumeOptimizerService.getResume(req.params.id)
      if (!result) return res.status(404).json({ message: 'Resume not found' })
      res.json(result)
    } catch (error) { next(error) }
  }

  async getUserResumes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await resumeOptimizerService.getUserResumes(req.userId!)
      res.json(result)
    } catch (error) { next(error) }
  }

  async deleteResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await resumeOptimizerService.deleteResume(req.params.id, req.userId!)
      res.json({ message: 'Resume deleted' })
    } catch (error) { next(error) }
  }

  async getPricing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pricing = await resumeOptimizerService.getPricing()
      res.json(pricing)
    } catch (error) { next(error) }
  }

  async downloadOriginal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filePath = await resumeOptimizerService.getOriginalFilePath(req.params.id, req.userId!)
      const resume = await resumeOptimizerService.getResume(req.params.id)
      res.download(filePath, resume.title)
    } catch (error) { next(error) }
  }
}

export const resumeOptimizerController = new ResumeOptimizerController()
