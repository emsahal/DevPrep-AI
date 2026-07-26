import { redis } from '@/utils/redis'

const AVAILABILITY_PREFIX = 'duel:available:'
const COOLDOWN_PREFIX = 'duel:cooldown:'
const COOLDOWN_TTL = 300
const DECLINE_THRESHOLD = 3
const DECLINE_WINDOW_TTL = 600
const DECLINE_COUNT_PREFIX = 'duel:decline_count:'

export class MatchmakingService {
  async setAvailable(userId: string, mode: string, topic: string): Promise<void> {
    if (!redis) return
    const key = `${AVAILABILITY_PREFIX}${mode}:${topic}`
    await redis.sadd(key, userId)
    await redis.expire(key, 7200)
  }

  async setUnavailable(userId: string, mode: string, topic: string): Promise<void> {
    if (!redis) return
    const key = `${AVAILABILITY_PREFIX}${mode}:${topic}`
    await redis.srem(key, userId)
  }

  async removeFromAll(userId: string): Promise<void> {
    if (!redis) return
    const keys = await redis.keys(`${AVAILABILITY_PREFIX}*`)
    for (const key of keys) {
      await redis.srem(key, userId)
    }
  }

  async findOpponent(userId: string, mode: string, topic: string): Promise<string | null> {
    if (!redis) return null
    const key = `${AVAILABILITY_PREFIX}${mode}:${topic}`
    const members = await redis.smembers(key)
    const candidates = members.filter(id => id !== userId)

    if (candidates.length === 0) return null

    for (const candidate of candidates) {
      const cooldownKey = `${COOLDOWN_PREFIX}${candidate}`
      const inCooldown = await redis.get(cooldownKey)
      if (!inCooldown) {
        return candidate
      }
    }

    return candidates[0]
  }

  async recordDecline(userId: string): Promise<void> {
    if (!redis) return
    const key = `${DECLINE_COUNT_PREFIX}${userId}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, DECLINE_WINDOW_TTL)

    if (count >= DECLINE_THRESHOLD) {
      await this.removeFromAll(userId)
      const cooldownKey = `${COOLDOWN_PREFIX}${userId}`
      await redis.set(cooldownKey, String(Date.now() + COOLDOWN_TTL * 1000), 'EX', COOLDOWN_TTL)
    }
  }

  async isOnCooldown(userId: string): Promise<boolean> {
    if (!redis) return false
    const val = await redis.get(`${COOLDOWN_PREFIX}${userId}`)
    return val !== null
  }
}

export const matchmakingService = new MatchmakingService()
