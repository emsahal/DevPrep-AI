import { Request, Response, NextFunction } from 'express'
import { authService } from '@/services/auth.service'
import type { AuthRequest } from '@/middleware/auth'

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refresh(refreshToken)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.userId!)
      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.userId!)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.updateProfile(req.userId!, req.body)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body
      await authService.changePassword(req.userId!, currentPassword, newPassword)
      res.json({ message: 'Password changed successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export const authController = new AuthController()
