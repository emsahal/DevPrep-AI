import api from '@/lib/axios'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | null
  role: string
  learningPrefs: Record<string, unknown> | null
  completedTopics: string[]
  savedResources: string[]
  createdAt: string
  updatedAt: string
}

export interface ProfileStats {
  totalTopics: number
  completedTopics: number
  completionRate: number
  totalQuizzes: number
  quizzesPassed: number
  totalFlashcards: number
  flashcardsStudied: number
  streakDays: number
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get('/auth/profile')
    return data
  },

  async updateProfile(data: { name?: string; avatar?: string; learningPrefs?: Record<string, unknown> }): Promise<UserProfile> {
    const { data: res } = await api.put('/auth/profile', data)
    return res
  },
}
