import { Router } from 'express'
import { bookmarkController } from '@/controllers/bookmark.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/', authenticate, bookmarkController.getAll.bind(bookmarkController))
router.post('/toggle', authenticate, bookmarkController.toggle.bind(bookmarkController))
router.delete('/:id', authenticate, bookmarkController.delete.bind(bookmarkController))

export default router
