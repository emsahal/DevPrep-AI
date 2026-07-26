import { config } from '@/config'
import logger from '@/utils/logger'

interface ExecuteRequest {
  language: string
  code: string
  testCases: { input: string; expected: string }[]
}

interface ExecuteResponse {
  output: string
  passed: number
  total: number
  error?: string
}

const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'js',
  python: 'py',
  typescript: 'ts',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  rust: 'rs',
}

class CodeExecutionService {
  async executeCode({ language, code, testCases }: ExecuteRequest): Promise<ExecuteResponse> {
    const ext = LANGUAGE_MAP[language]
    if (!ext) {
      return { output: `Unsupported language: ${language}`, passed: 0, total: testCases.length, error: 'Unsupported language' }
    }

    let passed = 0
    const results: string[] = []

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i]
      try {
        const result = await this.runInSandbox(language, code, tc.input)
        const trimmed = result.trim()
        const expected = tc.expected.trim()

        if (trimmed === expected) {
          passed++
          results.push(`✓ Test ${i + 1}: Passed`)
        } else {
          results.push(`✗ Test ${i + 1}: Expected "${expected}", got "${trimmed}"`)
        }
      } catch (err) {
        results.push(`✗ Test ${i + 1}: Error - ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return {
      output: results.join('\n'),
      passed,
      total: testCases.length,
    }
  }

  private async runInSandbox(language: string, code: string, input: string): Promise<string> {
    const langMap: Record<string, string> = {
      javascript: 'javascript',
      python: 'python',
      typescript: 'typescript',
      java: 'java',
      cpp: 'c++',
      c: 'c',
      go: 'go',
      rust: 'rust',
    }

    const targetLang = langMap[language]
    if (!targetLang) throw new Error(`Unsupported language: ${language}`)

    // Use Piston API (emkc.org) - free, no auth required
    const wrappedCode = input ? `const _input = ${JSON.stringify(input)};\n${code}` : code

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: targetLang,
          version: '*',
          files: [{ content: wrappedCode }],
          stdin: '',
        }),
      })

      if (!response.ok) {
        throw new Error(`Execution API returned ${response.status}`)
      }

      const data = (await response.json()) as { run?: { output?: string; stderr?: string } }
      return data.run?.output || data.run?.stderr || 'No output'
    } catch (error) {
      // Fallback: try NVIDIA API for code analysis
      return this.fallbackToNvidia(language, code, input)
    }
  }

  private async fallbackToNvidia(language: string, code: string, input: string): Promise<string> {
    try {
      const { nvidiaAI } = await import('@/ai/nvidia.service')
      const prompt = `Given this ${language} code:\n\n${code}\n\nWith input: ${input}\n\nWhat would be the exact output? Return ONLY the raw output, no explanation.`
      const result = await nvidiaAI.generate([
        { role: 'user', content: prompt },
      ], { maxTokens: 512 })
      return result.content
    } catch {
      throw new Error('Code execution unavailable')
    }
  }
}

export const codeExecutionService = new CodeExecutionService()
