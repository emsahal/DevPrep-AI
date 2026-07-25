import prisma from '@/utils/prisma'
import { getCached, setCache } from '@/utils/redis'
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
}

export const flashcardService = new FlashcardService()