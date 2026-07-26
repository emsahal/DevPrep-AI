import cron from 'node-cron'
import http from 'http'
import { config } from '@/config'
import logger from '@/utils/logger'

/**
 * Pings the /api/health endpoint to keep the Render free-tier instance warm.
 * Render spins down instances after ~15 min of inactivity.
 * This job fires every 14 minutes to prevent that.
 */
function pingHealthEndpoint(): void {
  // Always ping localhost internally — faster and no network round-trip
  const targetUrl = `http://localhost:${config.port}/api/health`
  const client = http

  const req = client.get(targetUrl, (res) => {
    let body = ''
    res.on('data', (chunk: Buffer) => { body += chunk.toString() })
    res.on('end', () => {
      if (res.statusCode === 200) {
        logger.info(`[keep-alive] Health ping OK — status ${res.statusCode}`)
      } else {
        logger.warn(`[keep-alive] Health ping returned status ${res.statusCode}: ${body}`)
      }
    })
  })

  req.on('error', (err: Error) => {
    logger.warn(`[keep-alive] Health ping failed: ${err.message}`)
  })

  req.setTimeout(10_000, () => {
    logger.warn('[keep-alive] Health ping timed out after 10s')
    req.destroy()
  })
}

export function startKeepAlive(): void {
  // Skip in development — no point pinging localhost constantly
  if (!config.isProd) {
    logger.info('[keep-alive] Skipped (not production)')
    return
  }

  // Run every 14 minutes  →  */14 * * * *
  cron.schedule('*/14 * * * *', () => {
    pingHealthEndpoint()
  })

  logger.info('[keep-alive] Cron scheduled — pinging /api/health every 14 minutes')
}
