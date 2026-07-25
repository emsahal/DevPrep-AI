import api from '@/lib/axios'
import type { Topic } from '@/types'

export interface DashboardStats {
  completedTopics: number
  totalTopics: number
  completionRate: number
  avgQuizScore: number
  quizAttempts: number
  streakDays: number
  totalFlashcards: number
  reviewedFlashcards: number
  flashcardProgress: number
}

export interface ActivityItem {
  type: 'quiz' | 'topic' | 'revision'
  action: string
  timestamp: string
  score?: number
  topic?: string
}

export interface LearningProgressItem {
  id: string
  name: string
  slug: string
  icon: string
  category: string
  totalTopics: number
  completedTopics: number
  progress: number
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get('/dashboard/stats')
    return data
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    const { data } = await api.get('/dashboard/activity')
    return data
  },

  async getLearningProgress(): Promise<LearningProgressItem[]> {
    const { data } = await api.get('/dashboard/progress')
    return data
  },

  async getContinueLearning(): Promise<Topic[]> {
    const { data } = await api.get('/dashboard/continue')
    return data
  },
}
