import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'

const prisma = new PrismaClient()

async function clearTopicData() {
  console.log('Clearing interview questions (MCQs)...')
  const { count: questions } = await prisma.question.deleteMany()

  console.log('Clearing quizzes...')
  const { count: quizzes } = await prisma.quiz.deleteMany()

  console.log('Clearing topics...')
  const { count: topics } = await prisma.topic.deleteMany()

  console.log(`Deleted ${questions} questions, ${quizzes} quizzes, ${topics} topics.`)
}

async function clearTopicCache() {
  try {
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      lazyConnect: true,
    })
    await redis.connect()
    const keys = await redis.keys('topic:*')
    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`Cleared ${keys.length} cached topic entries.`)
    }
    await redis.disconnect()
  } catch (err) {
    console.warn('Redis not cleared (optional):', err instanceof Error ? err.message : err)
  }
}

async function main() {
  await clearTopicData()
  await clearTopicCache()
  await prisma.$disconnect()
  console.log('\nDone. Topics and their MCQs are erased.')
}

main().catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})