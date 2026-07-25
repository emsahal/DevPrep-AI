import prisma from '@/utils/prisma'

export class SearchService {
  async search(query: string) {
    if (!query || query.length < 2) {
      return { topics: [], technologies: [], total: 0 }
    }

    const searchTerm = `%${query}%`

    const [topics, technologies] = await Promise.all([
      prisma.topic.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { title: 'asc' },
        take: 20,
        include: {
          technology: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.technology.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        include: {
          _count: { select: { topics: true } },
        },
      }),
    ])

    return {
      topics: topics.map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        description: t.description,
        difficulty: t.difficulty,
        technology: t.technology,
      })),
      technologies: technologies.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        category: t.category,
        icon: t.icon,
        topicCount: t._count.topics,
      })),
      total: topics.length + technologies.length,
    }
  }
}

export const searchService = new SearchService()
