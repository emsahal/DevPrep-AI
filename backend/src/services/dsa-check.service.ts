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
    const systemPrompt = `You are a beginner-friendly DSA code checker. Your ONLY job is to check if the user's solution correctly solves the problem.

RULES:
- Do NOT analyze time/space complexity.
- Do NOT suggest optimized approaches.
- If correct: isCorrect=true, feedback="Your solution is correct! Well done." or similar brief praise. issues=[].
- If incorrect: isCorrect=false, feedback="Not quite. Check your logic." with 1-2 issues pointing out what's wrong.

Return ONLY valid JSON:
{
  "isCorrect": true/false,
  "feedback": "brief 1 sentence",
  "issues": [],
  "suggestions": [],
  "timeComplexity": "",
  "spaceComplexity": "",
  "expectedApproach": "",
  "score": 0
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

Only check: does this solution produce the correct output for all examples and edge cases? Yes or no.`

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
