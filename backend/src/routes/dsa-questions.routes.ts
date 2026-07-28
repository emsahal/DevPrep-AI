import { Router } from 'express'
import { dsaQuestionsController } from '@/controllers/dsa-questions.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/', authenticate, dsaQuestionsController.getAll.bind(dsaQuestionsController))
router.get('/levels', authenticate, dsaQuestionsController.getLevels.bind(dsaQuestionsController))
router.get('/:id', authenticate, dsaQuestionsController.getById.bind(dsaQuestionsController))

export default router
