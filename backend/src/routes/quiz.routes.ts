import { Router } from 'express'
import { quizController } from '@/controllers/quiz.controller'
import { authenticate, optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/', optionalAuth, quizController.getAll.bind(quizController))
router.post('/ai-generate', authenticate, quizController.generateAIQuiz.bind(quizController))
router.get('/daily', authenticate, quizController.getDaily.bind(quizController))
router.get('/attempts', authenticate, quizController.getAttempts.bind(quizController))
router.get('/:id', optionalAuth, quizController.getById.bind(quizController))
router.post('/:id/submit', authenticate, quizController.submitAttempt.bind(quizController))

export default router
