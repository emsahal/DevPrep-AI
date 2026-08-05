import prisma from '@/utils/prisma'
import { getCached, setCache, invalidateCache } from '@/utils/redis'
import { AppError } from '@/middleware/errorHandler'
import { nvidiaAI } from '@/ai/nvidia.service'
import { normalizePagination, createPaginatedResult, NormalizedPagination } from '@/utils/pagination'

export class FlashcardService {
  async getAll(params: { page?: number; limit?: number; topicId?: string } = {}) {
    const { page, limit, topicId } = { ...normalizePagination(params), topicId: params.topicId }
    const cacheKey = `flashcards:${topicId || 'all'}:page:${page}:limit:${limit}`
    const cached = await getCached(cacheKey)
    if (cached) return cached

    const where = topicId ? { topicId } : {}
    const [cards, total] = await Promise.all([
      prisma.flashCard.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          topic: { select: { id: true, title: true, slug: true } },
        },
      }),
      prisma.flashCard.count({ where }),
    ])

    const pagination: NormalizedPagination = { page, limit, cursor: '' }
    const result = createPaginatedResult(
      cards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
        difficulty: c.difficulty,
        topic: c.topic,
      })),
      total,
      { page, limit, cursor: '' }
    )

    await setCache(cacheKey, result, 600)
    return result
  }

  async getDueCards(userId: string, limit = 20) {
    const now = new Date()

    const dueCards = await prisma.flashcardProgress.findMany({
      where: {
        userId,
        OR: [
          { nextReview: null },
          { nextReview: { lte: now } },
        ],
        status: { not: 'mastered' },
      },
      include: {
        flashCard: {
          include: {
            topic: { select: { id: true, title: true, slug: true } },
          },
        },
      },
      orderBy: { nextReview: 'asc' },
      take: limit,
    })

    const newCards = await prisma.flashCard.findMany({
      where: {
        topic: { isPublished: true },
        progress: { none: { userId } },
      },
      take: 10,
      orderBy: { order: 'asc' },
      include: {
        topic: { select: { id: true, title: true, slug: true } },
      },
    })

    const result = [
      ...dueCards.map((p) => ({
        id: p.flashCard.id,
        front: p.flashCard.front,
        back: p.flashCard.back,
        difficulty: p.flashCard.difficulty,
        topic: p.flashCard.topic,
        status: p.status,
        easeFactor: p.easeFactor,
        interval: p.interval,
        repetitions: p.repetitions,
      })),
      ...newCards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
        difficulty: c.difficulty,
        topic: c.topic,
        status: 'new' as const,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
      })),
    ]

    return result
  }

  async updateCard(userId: string, flashCardId: string, quality: number) {
    const card = await prisma.flashCard.findUnique({ where: { id: flashCardId } })
    if (!card) return null

    const existing = await prisma.flashcardProgress.findUnique({
      where: { userId_flashCardId: { userId, flashCardId } },
    })

    let easeFactor = existing?.easeFactor ?? 2.5
    let interval = existing?.interval ?? 0
    let repetitions = existing?.repetitions ?? 0

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

    if (quality < 3) {
      repetitions = 0
      interval = 0
    } else {
      repetitions++
      if (repetitions === 1) interval = 1
      else if (repetitions === 2) interval = 6
      else interval = Math.round(interval * easeFactor)
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    const status = interval >= 21 ? 'mastered' : interval >= 6 ? 'reviewing' : 'learning'

    const progress = await prisma.flashcardProgress.upsert({
      where: { userId_flashCardId: { userId, flashCardId } },
      update: { easeFactor, interval, repetitions, nextReview, status, lastReview: new Date() },
      create: { userId, flashCardId, easeFactor, interval, repetitions, nextReview, status },
    })

    return progress
  }

  async getSaved(userId: string, params: { page?: number; limit?: number } = {}) {
    const { page, limit } = normalizePagination(params)

    const progress = await prisma.flashcardProgress.findMany({
      where: { userId, status: 'reviewing' },
      include: {
        flashCard: {
          include: {
            topic: { select: { id: true, title: true, slug: true } },
          },
        },
      },
      orderBy: { nextReview: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.flashcardProgress.count({
      where: { userId, status: 'reviewing' },
    })

    return createPaginatedResult(
      progress.map((p) => ({
        id: p.flashCard.id,
        front: p.flashCard.front,
        back: p.flashCard.back,
        difficulty: p.flashCard.difficulty,
        topic: p.flashCard.topic,
        status: p.status,
        interval: p.interval,
        repetitions: p.repetitions,
        nextReview: p.nextReview,
      })),
      total,
      { page, limit, cursor: '' }
    )
  }

  async getStats(userId: string) {
    const [total, learned, reviewing, mastered, due] = await Promise.all([
      prisma.flashCard.count(),
      prisma.flashcardProgress.count({ where: { userId, status: 'learning' } }),
      prisma.flashcardProgress.count({ where: { userId, status: 'reviewing' } }),
      prisma.flashcardProgress.count({ where: { userId, status: 'mastered' } }),
      prisma.flashcardProgress.count({
        where: {
          userId,
          nextReview: { lte: new Date() },
          status: { not: 'mastered' },
        },
      }),
    ])

    return { total, learned, reviewing, mastered, due }
  }

  async generateForTopic(slug: string) {
    const topic = await prisma.topic.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        difficulty: true,
        technology: { select: { name: true } },
      },
    })
    if (!topic) throw new AppError(404, 'Topic not found')

    const existing = await prisma.flashCard.findMany({
      where: { topicId: topic.id },
      orderBy: { order: 'asc' },
      include: { topic: { select: { id: true, title: true, slug: true } } },
    })
    if (existing.length > 0) {
      return {
        topicId: topic.id,
        count: existing.length,
        alreadyExists: true,
        cards: existing.map((c) => ({
          id: c.id,
          front: c.front,
          back: c.back,
          difficulty: c.difficulty,
          topic: c.topic,
        })),
      }
    }

    const scopeContent = (topic.content || topic.description || '').trim().slice(0, 4500)

    const prompt = `You are an expert software engineering educator.
Create exactly 10 flashcards to help a learner memorize and revise the SPECIFIC topic "${topic.title}" (${topic.technology?.name || 'Software Engineering'}).

CRITICAL SCOPE RULE:
- Create flashcards ONLY about THIS specific topic "${topic.title}" and the covered content below.
- Do NOT cover broader or other sub-topics of the same technology that are NOT part of this lesson (for example, if the topic is "Introduction to HTML", create cards only about tags, elements, attributes, and document structure — NOT forms, media, APIs, or advanced HTML features).
${scopeContent ? `\nCOVERED CONTENT FOR THIS TOPIC (use this as the source of scope):\n${scopeContent}` : ''}

RULES:
1. Each card has "front" (the keyword or short question the learner is quizzed on, max 15 words) and "back" (the concise answer, max 40 words).
2. "front" must start with the keyword or a short question.
3. "back" must be a clear, accurate, self-contained answer using the lesson's technical terms.
4. Cards must be distinct — no duplicate or near-duplicate cards.

IMPORTANT: Return ONLY a valid JSON array in this exact format, with no markdown fences and no extra text:
[
  { "front": "Keyword or short question?", "back": "Concise answer." }
]`

    const response = await nvidiaAI.generate(
      [{ role: 'user', content: prompt }],
      { temperature: 0.6, maxTokens: 4096 }
    )

    let cards: Array<{ front: string; back: string }>
    try {
      const cleaned = response.content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
      const parsed = JSON.parse(cleaned)
      if (!Array.isArray(parsed)) throw new Error('Not an array')
      cards = parsed.slice(0, 10).map((c: any, index: number) => {
        if (typeof c.front !== 'string' || typeof c.back !== 'string' || !c.front.trim() || !c.back.trim()) {
          throw new Error(`Invalid card at index ${index}`)
        }
        return { front: c.front.trim(), back: c.back.trim() }
      })
      if (cards.length === 0) throw new Error('Empty cards')
    } catch {
      throw new AppError(500, 'AI returned invalid flashcard format. Please try again.')
    }

    await prisma.flashCard.createMany({
      data: cards.map((c, idx) => ({
        front: c.front,
        back: c.back,
        topicId: topic.id,
        difficulty: topic.difficulty || 'beginner',
        order: idx,
      })),
    })

    await invalidateCache('flashcards:*')

    return {
      topicId: topic.id,
      count: cards.length,
      alreadyExists: false,
      cards: cards.map((c, idx) => ({
        id: `${topic.id}-${idx}`,
        front: c.front,
        back: c.back,
        difficulty: topic.difficulty || 'beginner',
        topic: { id: topic.id, title: topic.title, slug: topic.slug },
      })),
    }
  }
}

export const flashcardService = new FlashcardService()