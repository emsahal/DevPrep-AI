import { Router } from 'express'
import { topicController } from '@/controllers/topic.controller'
import { authenticate, optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/:slug', optionalAuth, topicController.getBySlug.bind(topicController))
router.put('/progress', authenticate, topicController.updateProgress.bind(topicController))

export default router
