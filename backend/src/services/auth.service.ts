import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/utils/prisma'
import { config } from '@/config'
import { AppError } from '@/middleware/errorHandler'
import type { RegisterInput, LoginInput } from '@/validators/auth'
import type { Prisma } from '@prisma/client'

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

    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
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

    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    })

    const { password: _, refreshToken: _r, ...userData } = user
    return { user: userData, accessToken, refreshToken }
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
