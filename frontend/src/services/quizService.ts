import api, { apiBaseUrl } from '@/lib/axios'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface QuizListItem {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  passingScore: number
  isDaily: boolean
  questionCount: number
  topic: { id: string; title: string; slug: string }
  createdAt: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string | null
  order: number
}

export interface QuizDetail {
  id: string
  title: string
  description: string
  difficulty: string
  timeLimit: number
  passingScore: number
  isDaily: boolean
  topic: { id: string; title: string; slug: string }
  questions: QuizQuestion[]
}

export interface AttemptResult {
  id: string
  score: number
  passed: boolean
  totalQuestions: number
  correctAnswers: number
  answers: Array<{
    questionId: string
    questionText: string
    options: string[]
    selectedAnswer: number
    correctAnswer: number
    isCorrect: boolean
    explanation: string | null
  }>
  completedAt: string
}

export interface AttemptListItem {
  id: string
  quizId: string
  quizTitle: string
  difficulty: string
  score: number
  passed: boolean
  totalQuestions: number
  completedAt: string
}

export interface AIGeneratedQuiz {
  id: string
  title: string
  description: string
  difficulty: string
  isAIGenerated: true
  topic: { id: string; title: string }
  questions: QuizQuestion[]
}

export interface CreateAIQuizInput {
  topicId?: string
  customTopic?: string
  questionCount: number
  difficulty: string
  quizType: string
}

export const quizService = {
  async getAll(params: { page?: number; limit?: number; topicId?: string } = {}): Promise<PaginatedResponse<QuizListItem>> {
    const { data } = await api.get('/quizzes', { params })
    return data
  },

  async getById(id: string): Promise<QuizDetail> {
    const { data } = await api.get(`/quizzes/${id}`)
    return data
  },

  async streamQuizQuestions(
    id: string,
    onQuestion: (question: QuizQuestion) => void,
    onDone: () => void
  ): Promise<void> {
    const token = localStorage.getItem('accessToken')

    const response = await fetch(`${apiBaseUrl}/quizzes/${id}/stream`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(`Quiz stream failed: ${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.done) {
              onDone()
              return
            }
            if (parsed.type === 'question' && parsed.question) {
              onQuestion(parsed.question)
            }
          } catch {
            // skip
          }
        }
      }
    }
  },

  async getDaily(): Promise<QuizDetail> {
    const { data } = await api.get('/quizzes/daily')
    return data
  },

  async submitAttempt(quizId: string, answers: Array<{ questionId: string; selectedAnswer: number }>): Promise<AttemptResult> {
    const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers })
    return data
  },

  async getAttempts(params: { page?: number; limit?: number; quizId?: string } = {}): Promise<PaginatedResponse<AttemptListItem>> {
    const { data } = await api.get('/quizzes/attempts', { params })
    return data
  },

  async generateAIQuiz(topicId: string, questionCount: number, difficulty: string): Promise<QuizDetail> {
    const { data } = await api.post('/quizzes/ai-generate', { topicId, questionCount, difficulty })
    return data
  },

  async createAIQuiz(input: { topicId?: string; customTopic?: string; questionCount: number; difficulty: string; quizType: string }): Promise<QuizDetail> {
    const { data } = await api.post('/quizzes/ai-generate', input)
    return data
  },
}
