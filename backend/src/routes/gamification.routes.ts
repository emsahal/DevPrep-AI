import { Router } from 'express'
import { gamificationController } from '@/controllers/gamification.controller'
import { authenticate, optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/stats', authenticate, gamificationController.getStats.bind(gamificationController))
router.get('/leaderboard', optionalAuth, gamificationController.getLeaderboard.bind(gamificationController))
router.get('/badges', gamificationController.getBadges.bind(gamificationController))
router.get('/user-badges', authenticate, gamificationController.getUserBadges.bind(gamificationController))
router.get('/transactions', authenticate, gamificationController.getTransactions.bind(gamificationController))

export default router
