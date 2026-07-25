import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import dotenv from 'dotenv'
import { generateTopicContent } from './topic-content'

dotenv.config()

const prisma = new PrismaClient()

async function clearTopicCache() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  })
  redis.on('error', () => undefined)

  try {
    await redis.connect()
    const keys = await redis.keys('topic:*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
    console.log(`Cleared ${keys.length} cached topic entries.`)
  } catch {
    console.log('Redis cache not cleared because Redis is unavailable.')
  } finally {
    redis.disconnect()
  }
}

async function main() {
  const topics = await prisma.topic.findMany({
    include: {
      technology: true,
    },
    orderBy: [
      { technology: { order: 'asc' } },
      { order: 'asc' },
    ],
  })

  for (const topic of topics) {
    await prisma.topic.update({
      where: { id: topic.id },
      data: {
        content: generateTopicContent({
          slug: topic.slug,
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty,
          technologyName: topic.technology.name,
          technologySlug: topic.technology.slug,
          category: topic.category,
        }),
      },
    })
  }

  console.log(`Updated ${topics.length} topics with rich real content.`)
  await clearTopicCache()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
