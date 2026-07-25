import { Response, NextFunction } from 'express'
import { bookmarkService } from '@/services/bookmark.service'
import type { AuthRequest } from '@/middleware/auth'

export class BookmarkController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookmarks = await bookmarkService.getAll(req.userId!)
      res.json(bookmarks)
    } catch (error) {
      next(error)
    }
  }

  async toggle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type, itemId } = req.body
      const result = await bookmarkService.toggle(req.userId!, type, itemId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await bookmarkService.delete(req.userId!, req.params.id)
      res.json({ message: 'Bookmark removed' })
    } catch (error) {
      next(error)
    }
  }
}

export const bookmarkController = new BookmarkController()
