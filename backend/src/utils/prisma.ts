import { PrismaClient } from '@prisma/client'
import logger from './logger'

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
})

prisma.$on('warn' as never, (e: { message: string }) => {
  logger.warn(e.message)
})

prisma.$on('error' as never, (e: { message: string }) => {
  logger.error(e.message)
})

export default prisma
