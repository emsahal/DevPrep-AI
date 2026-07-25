import api from '@/lib/axios'

export interface RevisionNote {
  id: string
  title: string
  content: string
  summary: string | null
  type: 'note' | 'summary' | 'cheat-sheet'
  tags: string[]
  createdAt: string
  topic: { id: string; title: string; slug: string }
}

export interface RevisionTopic {
  id: string
  title: string
  slug: string
  description: string
  difficulty: string
  technology: { id: string; name: string; slug: string }
}

export const revisionService = {
  async getAll(type?: string): Promise<RevisionNote[]> {
    const params = type ? { type } : {}
    const { data } = await api.get('/revision', { params })
    return data
  },

  async generate(topicId: string, type: 'note' | 'summary' | 'cheat-sheet'): Promise<RevisionNote> {
    const { data } = await api.post('/revision/generate', { topicId, type })
    return data
  },

  async getTopics(): Promise<RevisionTopic[]> {
    const { data } = await api.get('/revision/topics')
    return data
  },

  async delete(id: string) {
    await api.delete(`/revision/${id}`)
  },
}
