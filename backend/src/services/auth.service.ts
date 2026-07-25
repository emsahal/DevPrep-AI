import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import prisma from '@/utils/prisma'
import { config } from '@/config'
import { AppError } from '@/middleware/errorHandler'
import type { RegisterInput, LoginInput, GoogleAuthInput } from '@/validators/auth'
import type { Prisma } from '@prisma/client'

interface GoogleTokenInfo {
  aud?: string
  sub?: string
  email?: string
  email_verified?: string | boolean
  name?: string
  picture?: string
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

    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        emailVerified: true,
        avatar: googleUser.avatar,
      },
      create: {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        emailVerified: true,
        password: await bcrypt.hash(`google:${crypto.randomUUID()}`, 12),
      },
      select: this.userSelect,
    })

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
