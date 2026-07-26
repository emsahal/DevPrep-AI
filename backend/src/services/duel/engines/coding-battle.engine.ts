import type { DuelEngine, DuelGameContent, PlayerSubmission, ScoredResult } from '../duel-engine.interface'
import { nvidiaAI } from '@/ai/nvidia.service'

export class CodingBattleEngine implements DuelEngine {
  async generate(mode: string, topic: string): Promise<DuelGameContent> {
    const prompt = `Generate a coding challenge for a ${topic} coding battle.
Return a JSON object with this exact structure (no markdown, no backticks):
{
  "type": "coding",
  "challenge": {
    "id": "c1",
    "title": "Short challenge title",
    "description": "Detailed problem description with examples",
    "starterCode": "function solve(input) {\\n  // Your code here\\n}",
    "language": "javascript",
    "testCases": [
      { "input": "test input 1", "expected": "expected output 1" },
      { "input": "test input 2", "expected": "expected output 2" }
    ]
  },
  "timeLimit": 600
}

Make it appropriate for ${topic}. Include 3-4 test cases. Use JavaScript.`

    const response = await nvidiaAI.generate([
      { role: 'system', content: 'You are a coding challenge generator. Return ONLY valid JSON.' },
      { role: 'user', content: prompt },
    ], { maxTokens: 2048 })

    try {
      const cleaned = response.content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const parsed = JSON.parse(cleaned)
      return {
        type: 'coding',
        challenge: parsed.challenge,
        timeLimit: parsed.timeLimit || 600,
      }
    } catch {
      // Fallback challenge
      return {
        type: 'coding',
        challenge: {
          id: 'c1',
          title: 'Reverse a String',
          description: 'Write a function that reverses a string.\n\nExample:\nInput: "hello"\nOutput: "olleh"',
          starterCode: 'function reverseString(str) {\n  // Your code here\n}',
          language: 'javascript',
          testCases: [
            { input: 'hello', expected: 'olleh' },
            { input: 'world', expected: 'dlrow' },
            { input: '', expected: '' },
            { input: 'a', expected: 'a' },
          ],
        },
        timeLimit: 600,
      }
    }
  }

  score(content: DuelGameContent, submission: PlayerSubmission): ScoredResult {
    const answers = submission.answers
    if (answers.length === 0) {
      return { score: 0, breakdown: { accuracy: 0, speed: 0, total: 0 } }
    }

    const lastAnswer = answers[answers.length - 1]
    const answerData = typeof lastAnswer.answer === 'string'
      ? JSON.parse(lastAnswer.answer)
      : lastAnswer.answer as { passed: number; total: number }

    const passed = answerData?.passed || 0
    const total = answerData?.total || 1
    const accuracy = total > 0 ? Math.round((passed / total) * 100) : 0
    const speed = Math.max(1, Math.round(submission.totalTimeMs / 1000))

    return {
      score: passed,
      breakdown: { accuracy, speed, total },
    }
  }

  determineWinner(
    p1: { userId: string } & ScoredResult,
    p2: { userId: string } & ScoredResult,
  ): { winnerId: string | null; score1: number; score2: number } {
    if (p1.score > p2.score) return { winnerId: p1.userId, score1: p1.score, score2: p2.score }
    if (p2.score > p1.score) return { winnerId: p2.userId, score1: p1.score, score2: p2.score }
    return { winnerId: null, score1: p1.score, score2: p2.score }
  }
}

export const codingBattleEngine = new CodingBattleEngine()
