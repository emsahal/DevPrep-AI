import prisma from '@/utils/prisma'
import { getCached, setCache, invalidateCache } from '@/utils/redis'
import logger from '@/utils/logger'
import { topicContentAI, type TopicGenerationInput } from './topic-content-ai.service'

interface TopicSeedInput {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  category: string
  content: string
  technology?: { name?: string } | null
}

export class TopicService {
  private generationPromises = new Map<string, Promise<string>>()

  private async ensureGenerated(topic: TopicSeedInput): Promise<string> {
    const inFlight = this.generationPromises.get(topic.id)
    if (inFlight) return inFlight

    const input: TopicGenerationInput = {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      difficulty: topic.difficulty,
      category: topic.category,
      technologyName: topic.technology?.name,
    }

    const promise = (async () => {
      try {
        const { roman, english, errors } = await topicContentAI.generateAndValidate(input)
        if (errors.length > 0) {
          logger.warn(`[TopicAI] invalid AI content for ${topic.slug}: ${errors.join('; ')}`)
          return topic.content
        }
        const content = topicContentAI.buildBilingualContent(input, roman, english)
        await prisma.topic.update({
          where: { id: topic.id },
          data: { content, aiGenerated: true, aiGeneratedAt: new Date() },
        })
        await invalidateCache(`topic:${topic.slug}`)
        logger.info(`[TopicAI] generated & persisted content for "${topic.title}"`)
        return content
      } catch (err) {
        logger.error(`[TopicAI] generation failed for ${topic.slug}: ${err instanceof Error ? err.message : err}`)
        return topic.content
      } finally {
        this.generationPromises.delete(topic.id)
      }
    })()

    this.generationPromises.set(topic.id, promise)
    return promise
  }
  async getBySlug(slug: string, userId?: string) {
    const cacheKey = `topic:${slug}`
    const cached = await getCached(cacheKey)
    if (cached) return cached

    const topic = await prisma.topic.findUnique({
      where: { slug },
      include: {
        technology: {
          select: { id: true, name: true, slug: true, category: true },
        },
        quizzes: {
          take: 1,
          include: {
            questions: {
              orderBy: { order: 'asc' },
              take: 15,
            },
          },
        },
        flashCards: {
          orderBy: { order: 'asc' },
          take: 10,
        },
        revisionNotes: {
          where: userId ? { userId } : {},
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!topic) return null

    if (!topic.aiGenerated) {
      topic.content = await this.ensureGenerated(topic)
    }

    const relatedTopics = await prisma.topic.findMany({
      where: {
        technologyId: topic.technologyId,
        id: { not: topic.id },
        isPublished: true,
      },
      orderBy: { order: 'asc' },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
      },
    })

    let userProgress = false
    if (userId) {
      const existingProgress = await prisma.userProgress.findUnique({
        where: { userId_topicId: { userId, topicId: topic.id } },
      })

      const hasRead = true
      const hasPassedQuiz = (existingProgress?.score ?? 0) >= 75
      const completed = hasPassedQuiz

      const progress = await prisma.userProgress.upsert({
        where: { userId_topicId: { userId, topicId: topic.id } },
        update: {
          hasRead,
          completed: existingProgress?.completed || completed,
        },
        create: {
          userId,
          topicId: topic.id,
          hasRead,
          completed,
          score: 0,
        },
      })

      if (completed && !existingProgress?.completed) {
        const { gamificationService } = await import('./gamification.service')
        await gamificationService.handleTopicCompleted(userId, topic.id, topic.difficulty)
      }

      userProgress = progress?.completed ?? false
    }

    const result = {
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      content: topic.content,
      difficulty: topic.difficulty,
      category: topic.category,
      order: topic.order,
      technology: topic.technology,
      relatedTopics,
      quizzes: topic.quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        questionCount: q.questions.length,
        questions: q.questions.map((qu) => ({
          id: qu.id,
          text: qu.text,
          options: qu.options,
          correctAnswer: qu.correctAnswer,
          explanation: qu.explanation,
        })),
      })),
      flashCards: topic.flashCards.map((fc) => ({
        id: fc.id,
        front: fc.front,
        back: fc.back,
        difficulty: fc.difficulty,
      })),
      revisionNotes: topic.revisionNotes.map((rn) => ({
        id: rn.id,
        title: rn.title,
        content: rn.content.substring(0, 200),
        type: rn.type,
        createdAt: rn.createdAt,
      })),
      completed: userProgress,
      references: [
        { title: 'Official Documentation', url: `https://developer.mozilla.org/en-US/docs/Web/${topic.title.replace(/\s+/g, '_')}` },
        { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
        { title: 'W3Schools', url: 'https://www.w3schools.com' },
      ],
    }

    await setCache(cacheKey, result, 300)
    return result
  }

  async getByTechnology(technologyId: string, params: { page?: number; limit?: number } = {}) {
    const pagination = { page: params.page ?? 1, limit: params.limit ?? 20 }
    const { skip, take } = { skip: (pagination.page - 1) * pagination.limit, take: pagination.limit + 1 }

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where: { technologyId, isPublished: true },
        orderBy: { order: 'asc' },
        skip,
        take,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          difficulty: true,
          order: true,
          createdAt: true,
        },
      }),
      prisma.topic.count({ where: { technologyId, isPublished: true } }),
    ])

    const hasNext = topics.length > pagination.limit
    const data = hasNext ? topics.slice(0, pagination.limit) : topics

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext,
        hasPrev: pagination.page > 1,
      },
    }
  }

  async updateProgress(userId: string, topicId: string, completed: boolean) {
    const topic = await prisma.topic.findUnique({ where: { id: topicId } })
    if (!topic) return null

    const existingProgress = await prisma.userProgress.findUnique({
      where: { userId_topicId: { userId, topicId } },
    })

    const hasRead = existingProgress?.hasRead ?? false
    const hasPassedQuiz = (existingProgress?.score ?? 0) >= 75

    // Enforce business rules: can only complete if requirements are met
    const targetCompleted = completed ? (hasRead && hasPassedQuiz) : false

    const progress = await prisma.userProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: { completed: targetCompleted },
      create: { userId, topicId, completed: targetCompleted, hasRead: false, score: 0 },
    })

    return progress
  }
}

export const topicService = new TopicService()