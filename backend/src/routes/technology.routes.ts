import { Router } from 'express'
import { technologyController } from '@/controllers/technology.controller'
import { optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/', technologyController.getAll.bind(technologyController))
router.get('/:slug', optionalAuth, technologyController.getBySlug.bind(technologyController))

export default router
