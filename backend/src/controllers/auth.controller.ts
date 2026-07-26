import { Request, Response, NextFunction } from 'express'
import { authService } from '@/services/auth.service'
import { config } from '@/config'
import type { AuthRequest } from '@/middleware/auth'

export class AuthController {
  private oauthCookieOptions = {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? ('none' as const) : ('lax' as const),
    maxAge: 10 * 60 * 1000,
  }

  private getBaseUrl(req: Request) {
    return `${req.protocol}://${req.get('host')}`
  }

  private redirectWithAuth(res: Response, result: { accessToken: string; refreshToken: string }) {
    const params = new URLSearchParams({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
    res.redirect(`${config.cors.frontendUrl}/auth/callback#${params.toString()}`)
  }

  private redirectWithError(res: Response, message: string) {
    const params = new URLSearchParams({ error: message })
    res.redirect(`${config.cors.frontendUrl}/auth/callback#${params.toString()}`)
  }

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

  async google(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.google(req.body)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async googleStart(req: Request, res: Response, next: NextFunction) {
    try {
      const state = authService.createOAuthState()
      const redirectUri = `${this.getBaseUrl(req)}/api/auth/google/callback`
      res.cookie('oauth_state', state, this.oauthCookieOptions)
      res.redirect(authService.getGoogleOAuthUrl(state, redirectUri))
    } catch (error) {
      next(error)
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query
      if (typeof code !== 'string' || typeof state !== 'string' || state !== req.cookies.oauth_state) {
        this.redirectWithError(res, 'Google sign-in failed')
        return
      }

      const redirectUri = `${this.getBaseUrl(req)}/api/auth/google/callback`
      const result = await authService.googleOAuthCallback(code, redirectUri)
      res.clearCookie('oauth_state')
      this.redirectWithAuth(res, result)
    } catch (error) {
      res.clearCookie('oauth_state')
      next(error)
    }
  }

  async githubStart(req: Request, res: Response, next: NextFunction) {
    try {
      const state = authService.createOAuthState()
      const redirectUri = `${this.getBaseUrl(req)}/api/auth/github/callback`
      res.cookie('oauth_state', state, this.oauthCookieOptions)
      res.redirect(authService.getGitHubOAuthUrl(state, redirectUri))
    } catch (error) {
      next(error)
    }
  }

  async githubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query
      if (typeof code !== 'string' || typeof state !== 'string' || state !== req.cookies.oauth_state) {
        this.redirectWithError(res, 'GitHub sign-in failed')
        return
      }

      const redirectUri = `${this.getBaseUrl(req)}/api/auth/github/callback`
      const result = await authService.githubOAuthCallback(code, redirectUri)
      res.clearCookie('oauth_state')
      this.redirectWithAuth(res, result)
    } catch (error) {
      res.clearCookie('oauth_state')
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
