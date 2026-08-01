import api from '@/lib/axios'

export interface AdminQuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string | null
  order: number
}

export interface AdminQuiz {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  topic: { id: string; title: string; slug: string }
  questionCount: number
  createdAt: string
}

export interface AdminQuizDetail {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  topic: { id: string; title: string; slug: string }
  questions: AdminQuizQuestion[]
}

export interface AdminInterviewTopic {
  slug: string
  name: string
  questionCount: number
}

export interface AdminInterviewQuestion {
  number: number
  question: string
  answer: string
}

export interface AdminInterviewDetail {
  slug: string
  name: string
  questionCount: number
  questions: AdminInterviewQuestion[]
}

export const adminService = {
  async getQuizzes(): Promise<AdminQuiz[]> {
    const { data } = await api.get('/admin/quizzes')
    return data
  },

  async getQuiz(id: string): Promise<AdminQuizDetail> {
    const { data } = await api.get(`/admin/quizzes/${id}`)
    return data
  },

  async getInterviewTopics(): Promise<AdminInterviewTopic[]> {
    const { data } = await api.get('/admin/interview-prep')
    return data
  },

  async getInterviewQuestions(slug: string): Promise<AdminInterviewDetail> {
    const { data } = await api.get(`/admin/interview-prep/${slug}`)
    return data
  },
}
