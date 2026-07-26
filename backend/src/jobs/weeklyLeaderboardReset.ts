import cron from 'node-cron'
import { gamificationService } from '@/services/gamification.service'
import logger from '@/utils/logger'

export function startWeeklyLeaderboardReset() {
  cron.schedule('0 0 * * 1', async () => {
    logger.info('Weekly leaderboard reset job started')
    try {
      await gamificationService.resetWeeklyLeaderboard()
      logger.info('Weekly leaderboard reset job completed')
    } catch (error) {
      logger.error('Weekly leaderboard reset job failed:', error)
    }
  })

  logger.info('Weekly leaderboard reset cron scheduled (every Monday 00:00)')
}
