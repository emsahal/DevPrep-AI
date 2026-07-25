import { Router } from 'express'
import { authController } from '@/controllers/auth.controller'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'
import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from '@/validators/auth'

const router = Router()

router.post('/register', validate(registerSchema), authController.register.bind(authController))
router.post('/login', validate(loginSchema), authController.login.bind(authController))
router.post('/refresh', validate(refreshSchema), authController.refresh.bind(authController))
router.post('/logout', authenticate, authController.logout.bind(authController))
router.get('/profile', authenticate, authController.getProfile.bind(authController))
router.put('/profile', authenticate, authController.updateProfile.bind(authController))
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword.bind(authController))

export default router
