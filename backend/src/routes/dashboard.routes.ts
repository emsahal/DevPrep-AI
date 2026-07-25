import { Router } from 'express'
import { dashboardController } from '@/controllers/dashboard.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/stats', authenticate, dashboardController.getStats.bind(dashboardController))
router.get('/activity', authenticate, dashboardController.getRecentActivity.bind(dashboardController))
router.get('/progress', authenticate, dashboardController.getLearningProgress.bind(dashboardController))
router.get('/continue', authenticate, dashboardController.getContinueLearning.bind(dashboardController))

export default router
