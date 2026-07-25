import { nvidiaAI } from '@/ai/nvidia.service'
import { CODE_ANALYSIS_SYSTEM_PROMPT, getCodeAnalysisPrompt } from '@/ai/code-analyzer.prompts'
import { getCached, setCache } from '@/utils/redis'
import crypto from 'crypto'

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

export class CodeAnalyzerService {
  async analyze(code: string, language: string): Promise<CodeAnalysisResult> {
    const cacheKey = `code:analysis:${crypto.createHash('md5').update(code + language).digest('hex')}`
    const cached = await getCached<CodeAnalysisResult>(cacheKey)
    if (cached) return cached

    const messages = [
      { role: 'system' as const, content: CODE_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user' as const, content: getCodeAnalysisPrompt(code, language) },
    ]

    const response = await nvidiaAI.generate(messages, {
      temperature: 0.2,
      maxTokens: 4096,
    })

    let result: CodeAnalysisResult
    try {
      const jsonStr = response.content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()
      result = JSON.parse(jsonStr) as CodeAnalysisResult
    } catch {
      result = this.parseFallback(response.content)
    }

    await setCache(cacheKey, result, 3600)
    return result
  }

  private parseFallback(content: string): CodeAnalysisResult {
    return {
      explanation: content.substring(0, 500),
      bugs: ['Could not parse structured analysis. See explanation above.'],
      logicErrors: [],
      codeSmells: [],
      refactoring: [],
      improvements: { readability: [], maintainability: [] },
      performance: [],
      security: [],
      testCases: [],
      documentation: '',
      timeComplexity: 'Unable to determine',
      spaceComplexity: 'Unable to determine',
    }
  }
}

export const codeAnalyzerService = new CodeAnalyzerService()
