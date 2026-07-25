import api from '@/lib/axios'

export interface InterviewPrepTopic {
  slug: string
  name: string
  questionCount: number
}

export interface InterviewPrepDetail {
  slug: string
  name: string
  content: string
  questionCount: number
}

export const interviewPrepService = {
  async getTopics(): Promise<InterviewPrepTopic[]> {
    const { data } = await api.get('/interview-prep')
    return data
  },

  async getBySlug(slug: string): Promise<InterviewPrepDetail> {
    const { data } = await api.get(`/interview-prep/${slug}`)
    return data
  },
}
