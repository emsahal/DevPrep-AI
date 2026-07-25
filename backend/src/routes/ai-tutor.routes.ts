import { Router } from 'express'
import { aiTutorController } from '@/controllers/ai-tutor.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.post('/chat', authenticate, aiTutorController.chat.bind(aiTutorController))
router.post('/chat/stream', authenticate, aiTutorController.chatStream.bind(aiTutorController))
router.get('/history', authenticate, aiTutorController.getHistory.bind(aiTutorController))
router.delete('/history', authenticate, aiTutorController.clearHistory.bind(aiTutorController))

export default router
