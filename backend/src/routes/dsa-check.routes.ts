import { Router } from 'express'
import { dsaCheckController } from '@/controllers/dsa-check.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.post('/check', authenticate, dsaCheckController.check.bind(dsaCheckController))

export default router
