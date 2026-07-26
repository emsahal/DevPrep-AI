import api from '@/lib/axios'

export interface MatchRequest {
  id: string
  fromUserId: string
  toUserId: string | null
  mode: string
  topic: string
  status: string
  createdAt: string
  expiresAt: string
  fromUser?: { id: string; name: string; avatar: string | null }
}

export interface DuelHistoryItem {
  id: string
  mode: string
  topic: string
  player1Id: string
  player2Id: string
  score1: number | null
  score2: number | null
  winnerId: string | null
  status: string
  startedAt: string
  endedAt: string | null
  player1: { id: string; name: string; avatar: string | null }
  player2: { id: string; name: string; avatar: string | null }
}

export const duelService = {
  async requestMatch(toUserId: string | null, mode: string, topic: string): Promise<MatchRequest> {
    const { data } = await api.post('/duels/request', { toUserId, mode, topic })
    return data
  },

  async acceptRequest(id: string): Promise<unknown> {
    const { data } = await api.post(`/duels/request/${id}/accept`)
    return data
  },

  async declineRequest(id: string): Promise<unknown> {
    const { data } = await api.post(`/duels/request/${id}/decline`)
    return data
  },

  async cancelRequest(id: string): Promise<unknown> {
    const { data } = await api.post(`/duels/request/${id}/cancel`)
    return data
  },

  async getHistory(page = 1, limit = 20): Promise<{ data: DuelHistoryItem[]; pagination: unknown }> {
    const { data } = await api.get('/duels/history', { params: { page, limit } })
    return data
  },
}
