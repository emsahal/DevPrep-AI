import api from '@/lib/axios'

export interface DSACheckResult {
  isCorrect: boolean
  feedback: string
  issues: string[]
  suggestions: string[]
  timeComplexity: string
  spaceComplexity: string
  expectedApproach: string
  score: number
}

export const dsaCheckService = {
  async check(params: {
    questionTitle: string
    questionProblem: string
    questionExamples: { input: string; output: string }[]
    code: string
    language?: string
  }): Promise<DSACheckResult> {
    const { data } = await api.post('/dsa-check/check', params)
    return data
  },
}