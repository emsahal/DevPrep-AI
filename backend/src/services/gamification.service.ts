import prisma from '@/utils/prisma'
import { getCached, setCache, invalidateCache } from '@/utils/redis'
import logger from '@/utils/logger'

const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

const STREAK_MULTIPLIERS = [
  { minDays: 0, multiplier: 1.0 },
  { minDays: 7, multiplier: 1.2 },
  { minDays: 14, multiplier: 1.5 },
  { minDays: 30, multiplier: 2.0 },
  { minDays: 100, multiplier: 3.0 },
]

function getStreakMultiplier(streakDays: number): number {
  let m = STREAK_MULTIPLIERS[0]
  for (const tier of STREAK_MULTIPLIERS) {
    if (streakDays >= tier.minDays) m = tier
  }
  return m.multiplier
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

function levelForXp(xp: number): number {
  let level = 1
  while (xpForLevel(level + 1) <= xp) level++
  return Math.min(level, 50)
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice', 2: 'Learner', 3: 'Apprentice', 4: 'Builder', 5: 'Explorer',
  6: 'Coder', 7: 'Developer', 8: 'Architect', 9: 'Strategist', 10: 'Ninja',
  11: 'Specialist', 12: 'Expert', 13: 'Master', 14: 'Sage', 15: 'Champion',
  16: 'Virtuoso', 17: 'Legend', 18: 'Code Whisperer', 19: 'Algorithm Ace', 20: 'Interview Ready',
  21: 'Senior Strategist', 22: 'Lead Architect', 23: 'Principal Engineer', 24: 'Staff Developer', 25: 'Fellow',
  26: 'Distinguished Engineer', 27: 'Chief Technologist', 28: 'Technical Director', 29: 'VP of Engineering', 30: 'CTO',
  31: 'Code Artisan', 32: 'System Sage', 33: 'Data Dragon', 34: 'Cloud Commander', 35: 'Security Sentinel',
  36: 'DevOps Deity', 37: 'AI Alchemist', 38: 'Full Stack Phoenix', 39: 'Open Source Oracle', 40: 'Legendary Developer',
  41: 'Polyglot Programmer', 42: 'Bug Exterminator', 43: 'Performance Guru', 44: 'Testing Titan', 45: 'Documentation Dynamo',
  46: 'Code Review Champion', 47: 'Hackathon Hero', 48: ' Mentor Extraordinaire', 49: 'Tech Visionary', 50: 'Grandmaster',
}

const BADGE_DEFINITIONS = [
  { key: 'streak_7', name: 'Weekly Warrior', description: 'Maintain a 7-day study streak', criteria: { type: 'streak_days', threshold: 7 } },
  { key: 'streak_30', name: 'Unstoppable', description: 'Maintain a 30-day study streak', criteria: { type: 'streak_days', threshold: 30 } },
  { key: 'streak_100', name: 'Century', description: 'Maintain a 100-day study streak', criteria: { type: 'streak_days', threshold: 100 } },
  { key: 'flashcards_100', name: 'Flashcard Collector', description: 'Master 100 flashcards', criteria: { type: 'flashcard_mastered_count', threshold: 100 } },
  { key: 'flashcards_500', name: 'Flashcard Master', description: 'Master 500 flashcards', criteria: { type: 'flashcard_mastered_count', threshold: 500 } },
  { key: 'quizzes_50', name: 'Quiz Taker', description: 'Complete 50 quizzes', criteria: { type: 'quiz_completed_count', threshold: 50 } },
  { key: 'quiz_perfect', name: 'Perfect Score', description: 'Score 100% on any quiz', criteria: { type: 'quiz_perfect', threshold: 1 } },
  { key: 'roadmap_complete_1', name: 'Pathfinder', description: 'Complete 1 roadmap', criteria: { type: 'roadmap_completed_count', threshold: 1 } },
  { key: 'roadmap_complete_5', name: 'Path Blazer', description: 'Complete 5 roadmaps', criteria: { type: 'roadmap_completed_count', threshold: 5 } },
  { key: 'top10_weekly', name: 'Top 10', description: 'Finish in the top 10 of the weekly leaderboard', criteria: { type: 'top10_weekly', threshold: 1 } },
  { key: 'level_10', name: 'Code Ninja', description: 'Reach level 10', criteria: { type: 'level_reached', threshold: 10 } },
  { key: 'level_25', name: 'Algorithm Ace', description: 'Reach level 25', criteria: { type: 'level_reached', threshold: 25 } },
  { key: 'points_10000', name: 'High Scorer', description: 'Earn 10,000 total points', criteria: { type: 'total_points', threshold: 10000 } },
]

function getDifficultyMultiplier(difficulty: string): number {
  return DIFFICULTY_MULTIPLIER[difficulty.toLowerCase()] || 1
}

export class GamificationService {
  async ensureStats(userId: string) {
    return prisma.userStats.upsert({
      where: { userId },
      update: {},
      create: { userId },
    })
  }

  async getStats(userId: string) {
    const cacheKey = `gamification:stats:${userId}`
    const cached = await getCached<unknown>(cacheKey)
    if (cached) return cached

    let stats = await prisma.userStats.findUnique({ where: { userId } })
    if (!stats) {
      stats = await this.ensureStats(userId)
    }

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    })

    const result = {
      totalPoints: stats.totalPoints,
      weeklyPoints: stats.weeklyPoints,
      xp: stats.xp,
      level: stats.level,
      title: LEVEL_TITLES[stats.level] || 'Grandmaster',
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      nextLevelXp: xpForLevel(stats.level + 1),
      currentLevelXp: xpForLevel(stats.level),
      badges: userBadges.map(ub => ({
        key: ub.badge.key,
        name: ub.badge.name,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        unlockedAt: ub.unlockedAt,
      })),
    }

    await setCache(cacheKey, result, 120)
    return result
  }

  async handleQuizCompleted(userId: string, quizId: string, score: number, difficulty: string) {
    const diffMult = getDifficultyMultiplier(difficulty)
    const basePoints = 50
    const accuracyMultiplier = score / 100
    const rawPoints = Math.round(basePoints * diffMult * accuracyMultiplier)

    return this.awardPoints(userId, rawPoints, 'quiz_completed', 'quiz', quizId)
  }

  async handleFlashcardReviewed(userId: string, flashcardId: string, newStatus: string) {
    if (newStatus !== 'mastered') return null
    return this.awardPoints(userId, 10, 'flashcard_mastered', 'flashcard', flashcardId)
  }

  async handleTopicCompleted(userId: string, topicId: string, difficulty: string) {
    const diffMult = getDifficultyMultiplier(difficulty)
    const rawPoints = Math.round(30 * diffMult)
    return this.awardPoints(userId, rawPoints, 'topic_completed', 'topic', topicId)
  }

  async handleRoadmapMilestone(userId: string, learningPathId: string) {
    return this.awardPoints(userId, 100, 'roadmap_milestone', 'learning_path', learningPathId)
  }

  private async awardPoints(userId: string, basePoints: number, reason: string, referenceType?: string, referenceId?: string) {
    let stats = await prisma.userStats.findUnique({ where: { userId } })
    if (!stats) {
      stats = await this.ensureStats(userId)
    }

    const streakDays = stats.currentStreak
    const multiplier = getStreakMultiplier(streakDays)
    const amount = Math.round(basePoints * multiplier)

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const isNewDay = !stats.lastActivityDate || stats.lastActivityDate < todayStart

    const updated = await prisma.$transaction(async (tx) => {
      const newStreak = isNewDay ? streakDays + 1 : streakDays
      const newLongestStreak = Math.max(newStreak, stats!.longestStreak)

      await tx.pointTransaction.create({
        data: {
          userId,
          amount,
          reason,
          referenceType,
          referenceId,
          multiplier,
          streakDays: newStreak,
        },
      })

      const updatedStats = await tx.userStats.update({
        where: { userId },
        data: {
          totalPoints: { increment: amount },
          weeklyPoints: { increment: amount },
          xp: { increment: amount },
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: now,
        },
      })

      const newLevel = levelForXp(updatedStats.xp)
      if (newLevel !== updatedStats.level) {
        await tx.userStats.update({
          where: { userId },
          data: { level: newLevel },
        })
        updatedStats.level = newLevel
      }

      return { ...updatedStats, level: newLevel, streakIncrement: isNewDay ? 1 : 0 }
    })

    await invalidateCache(`gamification:stats:${userId}`)
    await invalidateCache(`gamification:leaderboard:*`)

    if (isNewDay && streakDays > 0) {
      await this.handleDailyStreakBonus(userId, updated.currentStreak)
    }

    await this.checkBadges(userId, updated)

    return updated
  }

  private async handleDailyStreakBonus(userId: string, newStreak: number) {
    const streakPoints = 25
    const multiplier = getStreakMultiplier(newStreak)
    const bonus = Math.round(streakPoints * multiplier)

    await prisma.$transaction(async (tx) => {
      await tx.pointTransaction.create({
        data: {
          userId,
          amount: bonus,
          reason: 'daily_streak',
          multiplier,
          streakDays: newStreak,
        },
      })
      await tx.userStats.update({
        where: { userId },
        data: {
          totalPoints: { increment: bonus },
          weeklyPoints: { increment: bonus },
          xp: { increment: bonus },
        },
      })
    })

    await invalidateCache(`gamification:stats:${userId}`)
  }

  private async checkBadges(userId: string, stats: { totalPoints: number; level: number; currentStreak: number }) {
    const counts = await this.getUserCounts(userId)
    const existingBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    })
    const earnedKeys = new Set(existingBadges.map(b => b.badge.key))

    const allBadges = await prisma.badge.findMany()
    const newlyEarned: string[] = []

    for (const badge of allBadges) {
      if (earnedKeys.has(badge.key)) continue
      const criteria = badge.criteria as { type: string; threshold: number }
      if (this.meetsCriteria(criteria, stats, counts)) {
        await prisma.userBadge.create({
          data: { userId, badgeId: badge.id },
        })
        newlyEarned.push(badge.key)
      }
    }

    if (newlyEarned.length > 0) {
      logger.info(`Badges earned for user ${userId}: ${newlyEarned.join(', ')}`)
      await invalidateCache(`gamification:stats:${userId}`)
    }
  }

  private async getUserCounts(userId: string) {
    const [masteredCount, quizCount, perfectCount, roadmapCount] = await Promise.all([
      prisma.flashcardProgress.count({ where: { userId, status: 'mastered' } }),
      prisma.quizAttempt.count({ where: { userId, completed: true } }),
      prisma.quizAttempt.count({ where: { userId, score: 100, completed: true } }),
      prisma.userProgress.count({ where: { userId, completed: true } }),
    ])
    return { masteredCount, quizCount, perfectCount, roadmapCount }
  }

  private meetsCriteria(
    criteria: { type: string; threshold: number },
    stats: { totalPoints: number; level: number; currentStreak: number },
    counts: { masteredCount: number; quizCount: number; perfectCount: number; roadmapCount: number },
  ): boolean {
    switch (criteria.type) {
      case 'streak_days': return stats.currentStreak >= criteria.threshold
      case 'flashcard_mastered_count': return counts.masteredCount >= criteria.threshold
      case 'quiz_completed_count': return counts.quizCount >= criteria.threshold
      case 'quiz_perfect': return counts.perfectCount >= criteria.threshold
      case 'roadmap_completed_count': return counts.roadmapCount >= criteria.threshold
      case 'level_reached': return stats.level >= criteria.threshold
      case 'total_points': return stats.totalPoints >= criteria.threshold
      default: return false
    }
  }

  async ensureBadgeDefinitions() {
    for (const def of BADGE_DEFINITIONS) {
      await prisma.badge.upsert({
        where: { key: def.key },
        update: { name: def.name, description: def.description, criteria: def.criteria },
        create: def,
      })
    }
    logger.info(`Badge definitions synced (${BADGE_DEFINITIONS.length} badges)`)
  }

  async getLeaderboard(type: 'global' | 'weekly' | 'topic', page = 1, limit = 50, topicId?: string) {
    const cacheKey = `gamification:leaderboard:${type}:${topicId || ''}:${page}:${limit}`
    const cached = await getCached<unknown>(cacheKey)
    if (cached) return cached

    let entries: Array<{ userId: string; name: string; avatar: string | null; points: number; level: number }>

    if (type === 'topic' && topicId) {
      const rows = await prisma.userProgress.findMany({
        where: { topicId, completed: true, score: { not: null } },
        orderBy: { score: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { topic: { select: { title: true } } },
      })
      entries = rows.map(r => ({
        userId: '',
        name: '',
        avatar: null,
        points: r.score || 0,
        level: 0,
      }))
    } else {
      const orderField = type === 'weekly' ? 'weeklyPoints' : 'totalPoints'
      const rows = await prisma.userStats.findMany({
        orderBy: { [orderField]: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          user: { select: { name: true, avatar: true } },
        },
      })
      entries = rows.map(r => ({
        userId: r.userId,
        name: r.user.name,
        avatar: r.user.avatar,
        points: r[orderField],
        level: r.level,
      }))
    }

    const total = type === 'topic' && topicId
      ? await prisma.userProgress.count({ where: { topicId, completed: true, score: { not: null } } })
      : await prisma.userStats.count()

    const result = { entries, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    const ttl = type === 'global' ? 60 : type === 'weekly' ? 120 : 30
    await setCache(cacheKey, result, ttl)
    return result
  }

  async getCurrentUserRank(userId: string, type: 'global' | 'weekly'): Promise<{ rank: number; points: number } | null> {
    const stats = await prisma.userStats.findUnique({ where: { userId } })
    if (!stats) return null

    const orderField = type === 'weekly' ? 'weeklyPoints' : 'totalPoints'
    const rank = await prisma.userStats.count({
      where: { [orderField]: { gt: stats[orderField] } },
    })

    return { rank: rank + 1, points: stats[orderField] }
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.pointTransaction.count({ where: { userId } }),
    ])
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async getAllBadges() {
    const badges = await prisma.badge.findMany({ orderBy: { createdAt: 'asc' } })
    return badges.map(b => ({
      key: b.key,
      name: b.name,
      description: b.description,
      iconUrl: b.iconUrl,
      criteria: b.criteria,
    }))
  }

  async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    })
  }

  async resetWeeklyLeaderboard() {
    logger.info('Resetting weekly leaderboard...')
    const stats = await prisma.userStats.findMany({
      where: { weeklyPoints: { gt: 0 } },
      select: { userId: true, weeklyPoints: true, weeklyPointsArchived: true },
    })

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    for (const stat of stats) {
      const archived = (stat.weeklyPointsArchived as Array<{ weekStart: string; points: number }>) || []
      archived.push({ weekStart: weekStart.toISOString(), points: stat.weeklyPoints })
      await prisma.userStats.update({
        where: { userId: stat.userId },
        data: {
          weeklyPoints: 0,
          weeklyPointsArchived: archived,
        },
      })
    }

    logger.info(`Weekly leaderboard reset for ${stats.length} users`)
  }

  getLevelTitle(level: number): string {
    return LEVEL_TITLES[level] || 'Grandmaster'
  }
}

export const gamificationService = new GamificationService()
