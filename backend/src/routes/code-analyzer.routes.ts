import { Router } from 'express'
import { codeAnalyzerController } from '@/controllers/code-analyzer.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.post('/analyze', authenticate, codeAnalyzerController.analyze.bind(codeAnalyzerController))

export default router
