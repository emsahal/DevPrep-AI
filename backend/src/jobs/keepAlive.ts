import cron from 'node-cron'
import http from 'http'
import https from 'https'
import { config } from '@/config'
import logger from '@/utils/logger'

/**
 * Pings the /api/health endpoint to keep the Render free-tier instance warm.
 * Render spins down instances after ~15 min of inactivity.
 * This job fires every 14 minutes to prevent that.
 */
function pingHealthEndpoint(): void {
  // In production we hit the real public URL; locally we hit localhost
  const healthUrl = config.isProd
    ? `${config.cors.frontendUrl.replace('devpreps.tech', 'devprep-ai-xxvk.onrender.com')}/api/health`
    : `http://localhost:${config.port}/api/health`

  // Use the self-referencing internal URL on Render so there's no round-trip through the internet
  const internalUrl = config.isProd
    ? `http://localhost:${config.port}/api/health`
    : `http://localhost:${config.port}/api/health`

  const targetUrl = internalUrl
  const client = targetUrl.startsWith('https') ? https : http

  const req = client.get(targetUrl, (res) => {
    let body = ''
    res.on('data', (chunk) => { body += chunk })
    res.on('end', () => {
      if (res.statusCode === 200) {
        logger.info(`[keep-alive] Health ping OK — status ${res.statusCode}`)
      } else {
        logger.warn(`[keep-alive] Health ping returned status ${res.statusCode}: ${body}`)
      }
    })
  })

  req.on('error', (err) => {
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
