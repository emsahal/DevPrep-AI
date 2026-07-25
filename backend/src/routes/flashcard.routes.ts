import { Router } from 'express'
import { flashcardController } from '@/controllers/flashcard.controller'
import { authenticate, optionalAuth } from '@/middleware/auth'

const router = Router()

router.get('/', optionalAuth, flashcardController.getAll.bind(flashcardController))
router.get('/due', authenticate, flashcardController.getDueCards.bind(flashcardController))
router.get('/saved', authenticate, flashcardController.getSaved.bind(flashcardController))
router.get('/stats', authenticate, flashcardController.getStats.bind(flashcardController))
router.put('/:id/review', authenticate, flashcardController.updateCard.bind(flashcardController))

export default router
