import api from '@/lib/axios'

export interface TopicDetail {
  id: string
  title: string
  slug: string
  description: string
  content: string
  difficulty: string
  category: string
  order: number
  technology: { id: string; name: string; slug: string; category: string }
  relatedTopics: Array<{ id: string; title: string; slug: string; description: string; difficulty: string }>
  quizzes: Array<{
    id: string
    title: string
    description: string
    difficulty: string
    timeLimit: number
    questionCount: number
    questions: Array<{ id: string; text: string; options: string[]; correctAnswer: number; explanation: string | null }>
  }>
  flashCards: Array<{ id: string; front: string; back: string; difficulty: string }>
  revisionNotes: Array<{ id: string; title: string; content: string; type: string; createdAt: string }>
  completed: boolean
  references: Array<{ title: string; url: string }>
}

export const topicService = {
  async getBySlug(slug: string): Promise<TopicDetail> {
    const { data } = await api.get(`/topics/${slug}`)
    return data
  },

  async updateProgress(topicId: string, completed: boolean) {
    const { data } = await api.put('/topics/progress', { topicId, completed })
    return data
  },
}