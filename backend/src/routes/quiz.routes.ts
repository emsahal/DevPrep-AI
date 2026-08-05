import { Router } from 'express'
import { quizController } from '@/controllers/quiz.controller'
import { authenticate, optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/', optionalAuth, quizController.getAll.bind(quizController))
router.post('/ai-generate', authenticate, quizController.generateAIQuiz.bind(quizController))
router.post('/topic/:slug/generate', authenticate, quizController.generateForTopic.bind(quizController))
router.get('/daily', authenticate, quizController.getDaily.bind(quizController))
router.get('/attempts', authenticate, quizController.getAttempts.bind(quizController))
router.get('/test-nvidia', quizController.testNvidia.bind(quizController))
router.get('/:id/stream', optionalAuth, quizController.streamById.bind(quizController))
router.get('/:id', optionalAuth, quizController.getById.bind(quizController))
router.post('/:id/ai-explain', authenticate, quizController.aiExplain.bind(quizController))
router.post('/:id/questions', authenticate, quizController.addCustomQuestion.bind(quizController))
router.post('/:id/submit', authenticate, quizController.submitAttempt.bind(quizController))

export default router
