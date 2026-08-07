import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import prisma from '@/utils/prisma'
import { config } from '@/config'
import { AppError } from '@/middleware/errorHandler'
import type { RegisterInput, LoginInput, GoogleAuthInput } from '@/validators/auth'
import type { Prisma } from '@prisma/client'
import { sendOnboardingEmail } from '@/services/email.service'

interface GoogleTokenInfo {
  aud?: string
  sub?: string
  email?: string
  email_verified?: string | boolean
  name?: string
  picture?: string
}

interface GoogleTokenResponse {
  id_token?: string
  access_token?: string
  error?: string
  error_description?: string
}

interface GitHubTokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface GitHubUserResponse {
  login: string
  name?: string | null
  email?: string | null
  avatar_url?: string | null
}

interface GitHubEmailResponse {
  email: string
  primary: boolean
  verified: boolean
}

export class AuthService {
  private generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiry,
    } as jwt.SignOptions)
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry,
    } as jwt.SignOptions)
  }

  private verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, config.jwt.refreshSecret) as { userId: string }
  }

  private userSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.UserSelect

  private async issueTokens(user: { id: string; role: string }) {
    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    })

    return { accessToken, refreshToken }
  }

  private async verifyGoogleCredential(credential: string) {
    if (!config.google.clientId) {
      throw new AppError(500, 'Google sign-in is not configured')
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
    if (!response.ok) {
      throw new AppError(401, 'Invalid Google credential')
    }

    const tokenInfo = await response.json() as GoogleTokenInfo
    if (
      tokenInfo.aud !== config.google.clientId ||
      !tokenInfo.sub ||
      !tokenInfo.email ||
      tokenInfo.email_verified !== true && tokenInfo.email_verified !== 'true'
    ) {
      throw new AppError(401, 'Invalid Google credential')
    }

    return {
      email: tokenInfo.email.toLowerCase(),
      name: tokenInfo.name || tokenInfo.email.split('@')[0],
      avatar: tokenInfo.picture,
    }
  }

  private async createOAuthUser(input: { email: string; name: string; avatar?: string | null }) {
    return prisma.user.upsert({
      where: { email: input.email },
      update: {
        emailVerified: true,
        avatar: input.avatar || undefined,
      },
      create: {
        name: input.name,
        email: input.email,
        avatar: input.avatar || undefined,
        emailVerified: true,
        password: await bcrypt.hash(`oauth:${crypto.randomUUID()}`, 12),
      },
      select: this.userSelect,
    })
  }

  createOAuthState() {
    return crypto.randomBytes(24).toString('hex')
  }

  getGoogleOAuthUrl(state: string, redirectUri: string) {
    if (!config.google.clientId || !config.google.clientSecret) {
      throw new AppError(500, 'Google OAuth is not configured')
    }

    const params = new URLSearchParams({
      client_id: config.google.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  getGitHubOAuthUrl(state: string, redirectUri: string) {
    if (!config.github.clientId || !config.github.clientSecret) {
      throw new AppError(500, 'GitHub OAuth is not configured')
    }

    const params = new URLSearchParams({
      client_id: config.github.clientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      state,
    })

    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  async googleOAuthCallback(code: string, redirectUri: string) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenResponse = await response.json() as GoogleTokenResponse
    if (!response.ok || !tokenResponse.id_token) {
      throw new AppError(401, tokenResponse.error_description || 'Google sign-in failed')
    }

    const googleUser = await this.verifyGoogleCredential(tokenResponse.id_token)
    const user = await this.createOAuthUser(googleUser)
    const { accessToken, refreshToken } = await this.issueTokens(user)
    return { user, accessToken, refreshToken }
  }

  async githubOAuthCallback(code: string, redirectUri: string) {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json() as GitHubTokenResponse
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new AppError(401, tokenData.error_description || 'GitHub sign-in failed')
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    })
    if (!userResponse.ok) {
      throw new AppError(401, 'Unable to read GitHub profile')
    }

    const githubUser = await userResponse.json() as GitHubUserResponse
    let email = githubUser.email

    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/vnd.github+json',
        },
      })
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json() as GitHubEmailResponse[]
        email = emails.find((item) => item.primary && item.verified)?.email
          || emails.find((item) => item.verified)?.email
      }
    }

    if (!email) {
      throw new AppError(400, 'Your GitHub account needs a verified email address')
    }

    const user = await this.createOAuthUser({
      email: email.toLowerCase(),
      name: githubUser.name || githubUser.login,
      avatar: githubUser.avatar_url,
    })
    const { accessToken, refreshToken } = await this.issueTokens(user)
    return { user, accessToken, refreshToken }
  }

  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) {
      throw new AppError(409, 'Email already registered')
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: this.userSelect,
    })

    const { accessToken, refreshToken } = await this.issueTokens(user)

    // Trigger beautiful Resend onboarding email
    sendOnboardingEmail(user.email, user.name).catch((err) => {
      console.error('[Onboarding Email Error]', err)
    })

    return { user, accessToken, refreshToken }
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw new AppError(401, 'Invalid email or password')
    }

    const isValid = await bcrypt.compare(input.password, user.password)
    if (!isValid) {
      throw new AppError(401, 'Invalid email or password')
    }

    const { accessToken, refreshToken } = await this.issueTokens(user)

    const { password: _, refreshToken: _r, ...userData } = user
    return { user: userData, accessToken, refreshToken }
  }

  async google(input: GoogleAuthInput) {
    const googleUser = await this.verifyGoogleCredential(input.credential)

    const user = await this.createOAuthUser(googleUser)

    const { accessToken, refreshToken } = await this.issueTokens(user)
    return { user, accessToken, refreshToken }
  }

  async refresh(refreshToken: string) {
    let payload: { userId: string }
    try {
      payload = this.verifyRefreshToken(refreshToken)
    } catch {
      throw new AppError(401, 'Invalid refresh token')
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || !user.refreshToken) {
      throw new AppError(401, 'Invalid refresh token')
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!isValid) {
      throw new AppError(401, 'Invalid refresh token')
    }

    const newAccessToken = this.generateAccessToken(user.id, user.role)
    const newRefreshToken = this.generateRefreshToken(user.id)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(newRefreshToken, 10) },
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        learningPrefs: true,
        completedTopics: true,
        savedResources: true,
        bookmarks: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!user) {
      throw new AppError(404, 'User not found')
    }
    return user
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string; learningPrefs?: Prisma.InputJsonValue }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return user
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError(404, 'User not found')

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      throw new AppError(400, 'Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
  }
}

export const authService = new AuthService()
