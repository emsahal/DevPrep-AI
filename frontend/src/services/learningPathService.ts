import api from '@/lib/axios'

export interface LearningPathTech {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  topicCount: number
}

export interface LearningPathListItem {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  color: string
  category: string
  difficulty: string
  estimatedHours: number
  topicCount: number
  technologyCount: number
  technologies: LearningPathTech[]
  order: number
}

export interface PathTopic {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  order: number
  completed: boolean
}

export interface PathTechnology {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  topics: PathTopic[]
}

export interface LearningPathDetail {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  color: string
  category: string
  difficulty: string
  estimatedHours: number
  topicCount: number
  technologyCount: number
  technologies: PathTechnology[]
  completedTopics: number
  totalTopics: number
  progress: number
}

export const learningPathService = {
  async getAll(): Promise<LearningPathListItem[]> {
    const { data } = await api.get('/learning-paths')
    return data
  },

  async getBySlug(slug: string): Promise<LearningPathDetail> {
    const { data } = await api.get(`/learning-paths/${slug}`)
    return data
  },
}
