import { nvidiaAI } from '@/ai/nvidia.service'
import { getPrompt, type PromptType, getSystemPrompt } from '@/ai/prompts'
import prisma from '@/utils/prisma'
import { v4 as uuidv4 } from 'uuid'
import logger from '@/utils/logger'

export class AITutorService {
  async generateResponse(
    userId: string,
    query: string,
    type: PromptType,
    context: string = '',
    sessionId?: string
  ) {
    const sid = sessionId || uuidv4()
    const systemPrompt = getSystemPrompt()
    const userPrompt = getPrompt(type, query, context)

    await prisma.chatHistory.create({
      data: {
        userId,
        sessionId: sid,
        role: 'user',
        content: query,
        metadata: { type, context },
      },
    })

    const recentHistory = await prisma.chatHistory.findMany({
      where: { userId, sessionId: sid },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    for (const msg of recentHistory) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    }

    messages.push({ role: 'user', content: userPrompt })

    const response = await nvidiaAI.generate(messages, { maxTokens: 2048 })

    await prisma.chatHistory.create({
      data: {
        userId,
        sessionId: sid,
        role: 'assistant',
        content: response.content,
        metadata: { type },
      },
    })

    return {
      content: response.content,
      sessionId: sid,
      usage: response.usage,
    }
  }

  async generateStreamingResponse(
    userId: string,
    query: string,
    type: PromptType,
    context: string,
    onChunk: (chunk: string) => void,
    sessionId?: string
  ) {
    const sid = sessionId || uuidv4()
    const systemPrompt = getSystemPrompt()
    const userPrompt = getPrompt(type, query, context)

    await prisma.chatHistory.create({
      data: {
        userId,
        sessionId: sid,
        role: 'user',
        content: query,
        metadata: { type, context },
      },
    })

    const recentHistory = await prisma.chatHistory.findMany({
      where: { userId, sessionId: sid },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    for (const msg of recentHistory) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    }

    messages.push({ role: 'user', content: userPrompt })

    let fullContent = ''

    await nvidiaAI.generateStream(messages, (chunk) => {
      fullContent += chunk
      onChunk(chunk)
    })

    await prisma.chatHistory.create({
      data: {
        userId,
        sessionId: sid,
        role: 'assistant',
        content: fullContent,
        metadata: { type },
      },
    })

    return sid
  }

  async getHistory(userId: string, sessionId?: string) {
    const where = sessionId ? { userId, sessionId } : { userId }

    const history = await prisma.chatHistory.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 50,
    })

    const sessions = await prisma.chatHistory.groupBy({
      by: ['sessionId'],
      where: { userId },
      _min: { createdAt: true },
      _count: { id: true },
      orderBy: { _min: { createdAt: 'desc' } },
      take: 20,
    })

    return {
      messages: history.map((h) => ({
        id: h.id,
        role: h.role,
        content: h.content,
        createdAt: h.createdAt,
      })),
      sessions: sessions.map((s) => ({
        sessionId: s.sessionId,
        messageCount: s._count.id,
        createdAt: s._min.createdAt,
      })),
    }
  }

  async clearHistory(userId: string, sessionId?: string) {
    if (sessionId) {
      await prisma.chatHistory.deleteMany({
        where: { userId, sessionId },
      })
    } else {
      await prisma.chatHistory.deleteMany({
        where: { userId },
      })
    }
  }
}

export const aiTutorService = new AITutorService()
