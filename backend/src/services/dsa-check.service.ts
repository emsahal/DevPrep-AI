import { nvidiaAI } from '@/ai/nvidia.service'

export interface DSACheckResult {
  isCorrect: boolean
  feedback: string
  issues: string[]
  suggestions: string[]
  timeComplexity: string
  spaceComplexity: string
  expectedApproach: string
  score: number // 0-100
}

export class DSACheckService {
  async checkSolution(
    questionTitle: string,
    questionProblem: string,
    questionExamples: { input: string; output: string }[],
    userCode: string,
    language: string
  ): Promise<DSACheckResult> {
    const systemPrompt = `You are a DSA coding interview evaluator. Your job is to check if a user's solution correctly solves the given problem.

Return ONLY valid JSON in this exact format:
{
  "isCorrect": true/false,
  "feedback": "Brief overall assessment of the solution",
  "issues": ["Issue 1", "Issue 2", ...],
  "suggestions": ["Suggestion 1", "Suggestion 2", ...],
  "timeComplexity": "O(...) analysis",
  "spaceComplexity": "O(...) analysis",
  "expectedApproach": "Brief description of the expected optimal approach",
  "score": 0-100
}`

    const userPrompt = `Problem: ${questionTitle}

Description: ${questionProblem}

Examples:
${questionExamples.map((ex, i) => `Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}`).join('\n\n')}

User's Solution (${language}):
\`\`\`${language}
${userCode}
\`\`\`

Evaluate the solution. Check:
1. Does it solve the problem correctly for all cases?
2. Is the time/space complexity optimal?
3. Are there any bugs, edge cases, or logical errors?
4. Provide a score from 0-100.

Return the JSON evaluation.`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ]

    const response = await nvidiaAI.generate(messages, {
      temperature: 0.2,
      maxTokens: 2048,
    })

    try {
      const jsonStr = response.content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim()
      return JSON.parse(jsonStr) as DSACheckResult
    } catch {
      return {
        isCorrect: false,
        feedback: 'Could not parse evaluation. Please try again.',
        issues: ['AI response parsing failed'],
        suggestions: ['Make sure your code compiles and try again'],
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        expectedApproach: 'N/A',
        score: 0,
      }
    }
  }
}

export const dsaCheckService = new DSACheckService()
