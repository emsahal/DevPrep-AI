import { Router } from 'express'
import { revisionController } from '@/controllers/revision.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/', authenticate, revisionController.getAll.bind(revisionController))
router.get('/topics', authenticate, revisionController.getTopics.bind(revisionController))
router.post('/generate', authenticate, revisionController.generate.bind(revisionController))
router.delete('/:id', authenticate, revisionController.delete.bind(revisionController))

export default router
