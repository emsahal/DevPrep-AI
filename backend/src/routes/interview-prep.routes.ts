import { Router } from 'express'
import { interviewPrepController } from '@/controllers/interview-prep.controller'

const router = Router()

router.get('/', interviewPrepController.getTopics.bind(interviewPrepController))
router.get('/:slug', interviewPrepController.getBySlug.bind(interviewPrepController))

export default router
