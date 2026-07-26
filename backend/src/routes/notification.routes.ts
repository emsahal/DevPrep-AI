import { Router } from 'express'
import { notificationController } from '@/controllers/notification.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/', authenticate, notificationController.getAll.bind(notificationController))
router.get('/unread', authenticate, notificationController.getUnread.bind(notificationController))
router.post('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController))
router.post('/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController))

export default router
