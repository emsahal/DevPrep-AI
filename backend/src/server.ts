import app from './app'
import { config } from './config'
import logger from './utils/logger'
import prisma from './utils/prisma'
import { gamificationService } from './services/gamification.service'
import { startWeeklyLeaderboardReset } from './jobs/weeklyLeaderboardReset'

async function main() {
  try {
    await prisma.$connect()
    logger.info('Database connected successfully')

    await gamificationService.ensureBadgeDefinitions()
    startWeeklyLeaderboardReset()

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
      logger.info(`API Docs: http://localhost:${config.port}/api-docs`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...')
  await prisma.$disconnect()
  process.exit(0)
})
