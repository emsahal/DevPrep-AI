import Redis from 'ioredis'
import { config } from '@/config'
import logger from './logger'

let redis: Redis | null = null

try {
  redis = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null
      return Math.min(times * 200, 2000)
    },
    lazyConnect: true,
    enableReadyCheck: true,
    maxLoadingRetryTime: 5000,
  })

  redis.on('error', (err) => {
    logger.warn('Redis connection error (proceeding without cache):', err.message)
  })

  redis.on('connect', () => {
    logger.info('Redis connected successfully')
  })

  redis.on('ready', () => {
    logger.info('Redis ready')
  })
} catch {
  logger.warn('Redis not available, caching disabled')
}

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export async function setCache(key: string, data: unknown, ttl = 3600): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
  } catch {
    // silently fail
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis) return
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch {
    // silently fail
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch {
    // silently fail
  }
}

export async function getCacheTTL(key: string): Promise<number> {
  if (!redis) return -2
  try {
    return await redis.ttl(key)
  } catch {
    return -2
  }
}

export async function incrementCache(key: string, ttl = 3600): Promise<number> {
  if (!redis) return 0
  try {
    const val = await redis.incr(key)
    if (val === 1) await redis.expire(key, ttl)
    return val
  } catch {
    return 0
  }
}

export async function setCacheNX(key: string, data: unknown, ttl = 3600): Promise<boolean> {
  if (!redis) return false
  try {
    const result = await redis.set(key, JSON.stringify(data), 'EX', ttl, 'NX')
    return result === 'OK'
  } catch {
    return false
  }
}

export async function getMultipleCache<T>(keys: string[]): Promise<(T | null)[]> {
  if (!redis || keys.length === 0) return keys.map(() => null)
  try {
    const values = await redis.mget(...keys)
    return values.map(v => v ? JSON.parse(v) : null)
  } catch {
    return keys.map(() => null)
  }
}

export async function setMultipleCache(data: Record<string, unknown>, ttl = 3600): Promise<void> {
  if (!redis || Object.keys(data).length === 0) return
  try {
    const pipeline = redis.pipeline()
    for (const [key, value] of Object.entries(data)) {
      pipeline.setex(key, ttl, JSON.stringify(value))
    }
    await pipeline.exec()
  } catch {
    // silently fail
  }
}

export { redis }
