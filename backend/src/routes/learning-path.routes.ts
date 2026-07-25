import { Router } from 'express'
import { learningPathController } from '@/controllers/learning-path.controller'
import { optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/', optionalAuth, learningPathController.getAll.bind(learningPathController))
router.get('/:slug', optionalAuth, learningPathController.getBySlug.bind(learningPathController))

export default router
