import { Router } from 'express'
import { duelController } from '@/controllers/duel.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.post('/request', authenticate, duelController.requestMatch.bind(duelController))
router.post('/request/:id/accept', authenticate, duelController.acceptRequest.bind(duelController))
router.post('/request/:id/decline', authenticate, duelController.declineRequest.bind(duelController))
router.post('/request/:id/cancel', authenticate, duelController.cancelRequest.bind(duelController))
router.get('/history', authenticate, duelController.getHistory.bind(duelController))

export default router
