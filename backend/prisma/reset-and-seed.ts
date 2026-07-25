import { PrismaClient } from '@prisma/client'
import { execFileSync } from 'node:child_process'

const prisma = new PrismaClient()

async function reset() {
  console.log('Deleting current database data...')

  await prisma.bookmark.deleteMany()
  await prisma.chatHistory.deleteMany()
  await prisma.revisionNote.deleteMany()
  await prisma.flashcardProgress.deleteMany()
  await prisma.flashCard.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.learningPathTechnology.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.technology.deleteMany()

  console.log('Database data deleted.')
}

async function main() {
  await reset()
  await prisma.$disconnect()

  console.log('Seeding technologies, paths, and rich topics...')
  execFileSync('npx', ['tsx', 'prisma/seed.ts'], { stdio: 'inherit', shell: true })

  console.log('Seeding quizzes and flashcards...')
  execFileSync('npx', ['tsx', 'prisma/seed-content.ts'], { stdio: 'inherit', shell: true })

  console.log('Reset and seed completed.')
}

main()
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
