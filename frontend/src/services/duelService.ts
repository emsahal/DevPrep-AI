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
  async getActiveUsers(): Promise<any[]> {
    const { data } = await api.get('/duels/users/active')
    return data
  },

  async getPendingRequests(): Promise<any[]> {
    const { data } = await api.get('/duels/requests/pending')
    return data
  },

  async getRequestStatus(id: string): Promise<any> {
    const { data } = await api.get(`/duels/requests/${id}`)
    return data
  },

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

  async getDuel(id: string): Promise<any> {
    const { data } = await api.get(`/duels/${id}`)
    return data
  },

  async submitAnswer(id: string, questionId: string, answer: string): Promise<unknown> {
    const { data } = await api.post(`/duels/${id}/submit`, { questionId, answer })
    return data
  },

  async finishDuel(id: string): Promise<unknown> {
    const { data } = await api.post(`/duels/${id}/finish`)
    return data
  },
}
