import { Router } from 'express'
import { duelController } from '@/controllers/duel.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/users/active', authenticate, duelController.getActiveUsers.bind(duelController))
router.get('/requests/pending', authenticate, duelController.getPendingRequests.bind(duelController))
router.get('/requests/:id', authenticate, duelController.getRequestStatus.bind(duelController))
router.post('/request', authenticate, duelController.requestMatch.bind(duelController))
router.post('/request/:id/accept', authenticate, duelController.acceptRequest.bind(duelController))
router.post('/request/:id/decline', authenticate, duelController.declineRequest.bind(duelController))
router.post('/request/:id/cancel', authenticate, duelController.cancelRequest.bind(duelController))
router.get('/history', authenticate, duelController.getHistory.bind(duelController))
router.post('/run-code', authenticate, duelController.runCode.bind(duelController))
router.get('/:id', authenticate, duelController.getDuel.bind(duelController))
router.post('/:id/submit', authenticate, duelController.submitAnswer.bind(duelController))
router.post('/:id/finish', authenticate, duelController.finishDuel.bind(duelController))

export default router
