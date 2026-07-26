export interface DuelGameContent {
  type: 'quiz' | 'flashcard'
  questions: unknown[]
  timeLimit: number
}

export interface PlayerSubmission {
  userId: string
  answers: { questionId: string; answer: unknown; timestamp: number }[]
  totalTimeMs: number
}

export interface ScoredResult {
  score: number
  breakdown: { accuracy: number; speed: number; total: number }
}

export interface DuelEngine {
  generate(mode: string, topic: string, userId?: string): Promise<DuelGameContent>
  score(content: DuelGameContent, submission: PlayerSubmission): ScoredResult
  determineWinner(
    p1: { userId: string } & ScoredResult,
    p2: { userId: string } & ScoredResult,
  ): { winnerId: string | null; score1: number; score2: number }
}
