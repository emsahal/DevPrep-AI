import api from '@/lib/axios'

export interface ReviewInput {
  name: string
  role?: string
  rating: number
  text: string
}

export interface Review {
  id: string
  userId?: string
  name: string
  role: string
  rating: number
  text: string
  initials: string
  createdAt: string
}

export const reviewService = {
  async getReviews(): Promise<Review[]> {
    const { data } = await api.get<Review[]>('/reviews')
    return data
  },

  async createReview(input: ReviewInput): Promise<Review> {
    const { data } = await api.post<Review>('/reviews', input)
    return data
  },
}
