import api from '@/lib/axios'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface FlashCard {
  id: string
  front: string
  back: string
  difficulty: string
  topic: { id: string; title: string; slug: string }
  status?: string
  easeFactor?: number
  interval?: number
  repetitions?: number
  nextReview?: string
}

export interface FlashcardStats {
  total: number
  learned: number
  reviewing: number
  mastered: number
  due: number
}

export const flashcardService = {
  async getAll(params: { page?: number; limit?: number; topicId?: string } = {}): Promise<PaginatedResponse<FlashCard>> {
    const { data } = await api.get('/flashcards', { params })
    return data
  },

  async getDueCards(): Promise<FlashCard[]> {
    const { data } = await api.get('/flashcards/due')
    return data
  },

  async reviewCard(id: string, quality: number) {
    const { data } = await api.put(`/flashcards/${id}/review`, { quality })
    return data
  },

  async getSaved(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<FlashCard>> {
    const { data } = await api.get('/flashcards/saved', { params })
    return data
  },

  async getStats(): Promise<FlashcardStats> {
    const { data } = await api.get('/flashcards/stats')
    return data
  },
}
