import { Router } from 'express'
import { adminController } from '@/controllers/admin.controller'
import { authenticate } from '@/middleware/auth'
import { requireAdmin } from '@/middleware/admin'

const router = Router()

router.use(authenticate, requireAdmin)

router.get('/quizzes', adminController.getQuizzes.bind(adminController))
router.get('/quizzes/:id', adminController.getQuizById.bind(adminController))
router.get('/interview-prep', adminController.getInterviewTopics.bind(adminController))
router.get('/interview-prep/:slug', adminController.getInterviewQuestions.bind(adminController))
router.get('/interview-prep/:slug/format', adminController.formatInterviewAnswers.bind(adminController))
router.post('/topics/:slug/regenerate', adminController.regenerateTopicContent.bind(adminController))

export default router
