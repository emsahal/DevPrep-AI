import api from '@/lib/axios'
import type { UserStats, BadgeDef, UserBadge, LeaderboardResponse, PointTransaction } from '@/types'

export const gamificationService = {
  async getStats(): Promise<UserStats> {
    const { data } = await api.get('/gamification/stats')
    return data
  },

  async getLeaderboard(type: 'global' | 'weekly' | 'topic' = 'global', page = 1, limit = 50, topicId?: string): Promise<LeaderboardResponse> {
    const { data } = await api.get('/gamification/leaderboard', { params: { type, page, limit, topicId } })
    return data
  },

  async getBadges(): Promise<BadgeDef[]> {
    const { data } = await api.get('/gamification/badges')
    return data
  },

  async getUserBadges(): Promise<UserBadge[]> {
    const { data } = await api.get('/gamification/user-badges')
    return data
  },

  async getTransactions(page = 1, limit = 20): Promise<{ data: PointTransaction[]; pagination: unknown }> {
    const { data } = await api.get('/gamification/transactions', { params: { page, limit } })
    return data
  },
}
