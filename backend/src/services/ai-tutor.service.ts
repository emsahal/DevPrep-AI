import { nvidiaAI } from '@/ai/nvidia.service'
import { getPrompt, type PromptType, getSystemPrompt } from '@/ai/prompts'
import prisma from '@/utils/prisma'
import { v4 as uuidv4 } from 'uuid'
import logger from '@/utils/logger'

const ROMAN_URDU_TRIGGERS = [
  'roman urdu', 'roman-urdu', 'romanurdu',
  'urdu mein', 'urdu me', 'urdu mai',
  'roman mein', 'roman me', 'roman mai',
  'respond in urdu', 'reply in urdu', 'answer in urdu',
  'urdu men jawab', 'urdu mein bata', 'urdu me bata',
]

function detectLanguagePreference(messages: Array<{ role: string; content: string }>): string | null {
  // Scan messages in reverse to find the most recent language preference
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role !== 'user') continue
    const lower = msg.content.toLowerCase()
    if (ROMAN_URDU_TRIGGERS.some(trigger => lower.includes(trigger))) {
      return 'Roman Urdu'
    }
    // Check if user explicitly asked for English
    if (lower.includes('respond in english') || lower.includes('reply in english') || lower.includes('switch to english')) {
      return 'English'
    }
  }
  return null
}

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

    // Detect language preference from conversation history
    const langPref = detectLanguagePreference(recentHistory.map(m => ({ role: m.role, content: m.content })))
    let finalSystemPrompt = systemPrompt
    if (langPref === 'Roman Urdu') {
      finalSystemPrompt += '\n\nIMPORTANT: The user has requested responses in Roman Urdu. You MUST respond in easy Roman Urdu for this and ALL subsequent messages. Do NOT switch back to English unless the user explicitly asks.'
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: finalSystemPrompt },
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

    // Detect language preference from conversation history
    const langPref = detectLanguagePreference(recentHistory.map(m => ({ role: m.role, content: m.content })))
    let finalSystemPrompt = systemPrompt
    if (langPref === 'Roman Urdu') {
      finalSystemPrompt += '\n\nIMPORTANT: The user has requested responses in Roman Urdu. You MUST respond in easy Roman Urdu for this and ALL subsequent messages. Do NOT switch back to English unless the user explicitly asks.'
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: finalSystemPrompt },
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
      sessions: await Promise.all(
        sessions.map(async (s) => {
          // Fetch first user message to use as session title
          const firstMsg = await prisma.chatHistory.findFirst({
            where: { userId, sessionId: s.sessionId, role: 'user' },
            orderBy: { createdAt: 'asc' },
            select: { content: true },
          })
          return {
            sessionId: s.sessionId,
            messageCount: s._count.id,
            createdAt: s._min.createdAt,
            title: firstMsg?.content?.substring(0, 60) || 'New Chat',
          }
        })
      ),
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
