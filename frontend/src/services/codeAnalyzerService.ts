import api from '@/lib/axios'

export interface CodeAnalysisResult {
  explanation: string
  bugs: string[]
  logicErrors: string[]
  codeSmells: string[]
  refactoring: string[]
  improvements: {
    readability: string[]
    maintainability: string[]
  }
  performance: string[]
  security: string[]
  testCases: string[]
  documentation: string
  timeComplexity: string
  spaceComplexity: string
}

export const codeAnalyzerService = {
  async analyze(code: string, language = 'javascript'): Promise<CodeAnalysisResult> {
    const { data } = await api.post('/code-analyzer/analyze', { code, language })
    return data
  },
}
