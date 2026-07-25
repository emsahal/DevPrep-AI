import api from '@/lib/axios'

export interface TechItem {
  id: string
  name: string
  slug: string
  description: string
  category: string
  icon: string
  color: string
  order: number
  topicCount: number
}

export interface TechnologiesResponse {
  categories: string[]
  technologies: TechItem[]
}

export interface TechTopic {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  order: number
  completed: boolean
  createdAt: string
}

export interface TechnologyDetail {
  id: string
  name: string
  slug: string
  description: string
  category: string
  icon: string
  color: string
  topics: TechTopic[]
  totalTopics: number
  completedTopics: number
  progress: number
}

export const technologyService = {
  async getAll(): Promise<TechnologiesResponse> {
    const { data } = await api.get('/technologies')
    return data
  },

  async getBySlug(slug: string): Promise<TechnologyDetail> {
    const { data } = await api.get(`/technologies/${slug}`)
    return data
  },
}
