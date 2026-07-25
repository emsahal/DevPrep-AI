import prisma from '@/utils/prisma'
import { getCached, setCache } from '@/utils/redis'

export class DashboardService {
  async getStats(userId: string) {
    const cacheKey = `dashboard:stats:${userId}`
    const cached = await getCached<typeof stats>(cacheKey)
    if (cached) return cached

    const [
      completedTopics,
      totalTopics,
      quizAttempts,
      streakDays,
      totalFlashcards,
      reviewedFlashcards,
    ] = await Promise.all([
      prisma.userProgress.count({ where: { userId, completed: true } }),
      prisma.topic.count({ where: { isPublished: true } }),
      prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: 10,
      }),
      this.calculateStreak(userId),
      prisma.flashCard.count(),
      prisma.flashcardProgress.count({ where: { userId, status: 'reviewing' } }),
    ])

    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0

    const stats = {
      completedTopics,
      totalTopics,
      completionRate: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      avgQuizScore: avgScore,
      quizAttempts: quizAttempts.length,
      streakDays,
      totalFlashcards,
      reviewedFlashcards,
      flashcardProgress: totalFlashcards > 0 ? Math.round((reviewedFlashcards / totalFlashcards) * 100) : 0,
    }

    await setCache(cacheKey, stats, 300)
    return stats
  }

  async getRecentActivity(userId: string) {
    const cacheKey = `dashboard:activity:${userId}`
    const cached = await getCached<typeof activity>(cacheKey)
    if (cached) return cached

    const [quizAttempts, progress, revisions] = await Promise.all([
      prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: 5,
        include: {
          quiz: { select: { title: true } },
        },
      }),
      prisma.userProgress.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          topic: { select: { title: true } },
        },
      }),
      prisma.revisionNote.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          topic: { select: { title: true } },
        },
      }),
    ])

    const activity: Array<{
      type: 'quiz' | 'topic' | 'revision'
      action: string
      timestamp: string
      score?: number
      topic?: string
    }> = []

    quizAttempts.forEach((q) => {
      activity.push({
        type: 'quiz',
        action: `Completed quiz: ${q.quiz.title}`,
        timestamp: q.startedAt.toISOString(),
        score: q.score,
      })
    })

    progress.forEach((p) => {
      activity.push({
        type: 'topic',
        action: p.completed ? `Completed topic: ${p.topic.title}` : `Started topic: ${p.topic.title}`,
        timestamp: p.updatedAt.toISOString(),
        topic: p.topic.title,
      })
    })

    revisions.forEach((r) => {
      activity.push({
        type: 'revision',
        action: `Created revision note: ${r.title}`,
        timestamp: r.createdAt.toISOString(),
        topic: r.topic.title,
      })
    })

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const result = activity.slice(0, 10)

    await setCache(cacheKey, result, 300)
    return result
  }

  async getLearningProgress(userId: string) {
    const cacheKey = `dashboard:progress:${userId}`
    const cached = await getCached<typeof result>(cacheKey)
    if (cached) return cached

    const technologies = await prisma.technology.findMany({
      orderBy: { order: 'asc' },
      include: {
        topics: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
    })

    const progressMap = new Map(userProgress.map((p) => [p.topicId, p]))

    const result = technologies.map((tech) => {
      const totalTopics = tech.topics.length
      const completedTopics = tech.topics.filter((t) => progressMap.get(t.id)?.completed).length
      return {
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        icon: tech.icon,
        category: tech.category,
        totalTopics,
        completedTopics,
        progress: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      }
    })

    await setCache(cacheKey, result, 300)
    return result
  }

  async getContinueLearning(userId: string) {
    const inProgress = await prisma.userProgress.findMany({
      where: { userId, completed: false },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            difficulty: true,
            technologyId: true,
          },
        },
      },
    })

    if (inProgress.length > 0) return inProgress.map((p) => p.topic)

    const topics = await prisma.topic.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        technologyId: true,
      },
    })

    return topics
  }

  private async calculateStreak(userId: string): Promise<number> {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, completed: true },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' },
    })

    if (!attempts.length) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dates = new Set<string>()
    attempts.forEach((a) => {
      if (a.completedAt) {
        const d = new Date(a.completedAt)
        d.setHours(0, 0, 0, 0)
        dates.add(d.toISOString())
      }
    })

    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      if (dates.has(date.toISOString())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  }
}

export const dashboardService = new DashboardService()
