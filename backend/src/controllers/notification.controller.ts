import { Response, NextFunction } from 'express'
import { notificationService } from '@/services/notification.service'
import type { AuthRequest } from '@/middleware/auth'

export class NotificationController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const result = await notificationService.getAll(req.userId!, page, limit)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getUnread(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.getUnread(req.userId!)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notif = await notificationService.markAsRead(req.params.id, req.userId!)
      if (!notif) return res.status(404).json({ message: 'Notification not found' })
      res.json(notif)
    } catch (error) {
      next(error)
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAllAsRead(req.userId!)
      res.json({ message: 'All notifications marked as read' })
    } catch (error) {
      next(error)
    }
  }
}

export const notificationController = new NotificationController()
