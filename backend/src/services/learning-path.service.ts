import prisma from '@/utils/prisma'
import { getCached, setCache } from '@/utils/redis'

export class LearningPathService {
  async getAll(userId?: string) {
    const cacheKey = 'learning-paths:all'
    const cached = await getCached<typeof result>(cacheKey)
    if (cached) return cached

    const paths = await prisma.learningPath.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      include: {
        technologies: {
          orderBy: { order: 'asc' },
          include: {
            technology: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
                _count: { select: { topics: true } },
              },
            },
          },
        },
      },
    })

    let userProgress: Map<string, boolean> = new Map()
    if (userId) {
      const progress = await prisma.userProgress.findMany({
        where: { userId },
        select: { topicId: true, completed: true },
      })
      userProgress = new Map(progress.map((p) => [p.topicId, p.completed]))
    }

    const result = paths.map((path) => {
      const technologies = path.technologies.map((pt) => ({
        ...pt.technology,
        topicCount: pt.technology._count.topics,
      }))

      return {
        id: path.id,
        title: path.title,
        slug: path.slug,
        description: path.description,
        icon: path.icon,
        color: path.color,
        category: path.category,
        difficulty: path.difficulty,
        estimatedHours: path.estimatedHours,
        topicCount: path.topicCount,
        technologyCount: technologies.length,
        technologies,
        order: path.order,
      }
    })

    await setCache(cacheKey, result, 3600)
    return result
  }

  async getBySlug(slug: string, userId?: string) {
    const cacheKey = `learning-path:${slug}`
    const cached = await getCached<typeof result>(cacheKey)
    if (cached) return cached

    const path = await prisma.learningPath.findUnique({
      where: { slug },
      include: {
        technologies: {
          orderBy: { order: 'asc' },
          include: {
            technology: {
              include: {
                topics: {
                  where: { isPublished: true },
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    difficulty: true,
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!path) return null

    let userProgress: Map<string, boolean> = new Map()
    if (userId) {
      const progress = await prisma.userProgress.findMany({
        where: { userId },
        select: { topicId: true, completed: true },
      })
      userProgress = new Map(progress.map((p) => [p.topicId, p.completed]))
    }

    const technologies = path.technologies.map((pt) => ({
      id: pt.technology.id,
      name: pt.technology.name,
      slug: pt.technology.slug,
      icon: pt.technology.icon,
      color: pt.technology.color,
      topics: pt.technology.topics.map((t) => ({
        ...t,
        completed: userProgress.get(t.id) || false,
      })),
    }))

    const allTopics = technologies.flatMap((t) => t.topics)
    const completedTopics = allTopics.filter((t) => t.completed).length

    const result = {
      id: path.id,
      title: path.title,
      slug: path.slug,
      description: path.description,
      icon: path.icon,
      color: path.color,
      category: path.category,
      difficulty: path.difficulty,
      estimatedHours: path.estimatedHours,
      topicCount: path.topicCount,
      technologyCount: technologies.length,
      technologies,
      completedTopics,
      totalTopics: allTopics.length,
      progress: allTopics.length > 0 ? Math.round((completedTopics / allTopics.length) * 100) : 0,
    }

    await setCache(cacheKey, result, 300)
    return result
  }
}

export const learningPathService = new LearningPathService()
