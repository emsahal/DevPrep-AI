import { Router } from 'express'
import { reviewController } from '@/controllers/review.controller'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.get('/', reviewController.getReviews.bind(reviewController))
router.post('/', authenticate, reviewController.createReview.bind(reviewController))

export default router
