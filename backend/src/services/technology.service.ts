import prisma from '@/utils/prisma'
import { getCached, setCache } from '@/utils/redis'
import { normalizePagination, createPaginatedResult } from '@/utils/pagination'

export class TechnologyService {
  async getAll() {
    const cacheKey = 'technologies:all'
    const cached = await getCached(cacheKey)
    if (cached) return cached

    const technologies = await prisma.technology.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { topics: true } },
      },
    })

    const categories = [...new Set(technologies.map((t) => t.category))]

    const result = {
      categories,
      technologies: technologies.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        category: t.category,
        icon: t.icon,
        color: t.color,
        order: t.order,
        topicCount: t._count.topics,
      })),
    }

    await setCache(cacheKey, result, 3600)
    return result
  }

  async getBySlug(slug: string, userId?: string, params: { page?: number; limit?: number } = {}) {
    const cacheKey = `technology:${slug}`
    const cached = await getCached(cacheKey)
    if (cached) return cached

    const technology = await prisma.technology.findUnique({
      where: { slug },
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
            createdAt: true,
          },
        },
      },
    })

    if (!technology) return null

    let userProgress: Map<string, boolean> = new Map()
    if (userId) {
      const progress = await prisma.userProgress.findMany({
        where: { userId },
        select: { topicId: true, completed: true },
      })
      userProgress = new Map(progress.map((p) => [p.topicId, p.completed]))
    }

    const allTopics = technology.topics.map((t) => ({
      ...t,
      completed: userProgress.get(t.id) || false,
    }))
    const total = allTopics.length

    const pagination = { page: params.page ?? 1, limit: params.limit ?? 20 }
    const start = (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    const topics = allTopics.slice(start, end)

    const result = {
      id: technology.id,
      name: technology.name,
      slug: technology.slug,
      description: technology.description,
      category: technology.category,
      icon: technology.icon,
      color: technology.color,
      topics,
      totalTopics: total,
      completedTopics: allTopics.filter((t) => t.completed).length,
      progress: total > 0 ? Math.round((allTopics.filter((t) => t.completed).length / total) * 100) : 0,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext: end < total,
        hasPrev: pagination.page > 1,
      },
    }

    await setCache(cacheKey, result, 300)
    return result
  }
}

export const technologyService = new TechnologyService()