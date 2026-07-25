import api from '@/lib/axios'

export interface SearchTopicResult {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  technology: { id: string; name: string; slug: string }
}

export interface SearchTechResult {
  id: string
  name: string
  slug: string
  description: string
  category: string
  icon: string
  topicCount: number
}

export interface SearchResults {
  topics: SearchTopicResult[]
  technologies: SearchTechResult[]
  total: number
}

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    const { data } = await api.get('/search', { params: { q: query } })
    return data
  },
}
