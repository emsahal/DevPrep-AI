import prisma from '@/utils/prisma'
import type { DuelGameContent, DuelEngine, PlayerSubmission, ScoredResult } from '../duel-engine.interface'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export class FlashcardSprintEngine implements DuelEngine {
  async generate(mode: string, topic: string): Promise<DuelGameContent> {
    const cards = await prisma.flashCard.findMany({
      where: topic !== 'any' ? { topic: { slug: topic } } : undefined,
      take: 20,
    })

    const selected = shuffleArray(cards).slice(0, 15)

    return {
      type: 'flashcard',
      questions: selected.map(c => ({
        id: c.id,
        front: c.front,
        back: c.back,
        timeLimit: 15,
      })),
      timeLimit: selected.length * 15,
    }
  }

  score(content: DuelGameContent, submission: PlayerSubmission): ScoredResult {
    const cards = content.questions as Array<{ id: string; back: string }>
    const cMap = new Map(cards.map(c => [c.id, c.back.toLowerCase().trim()]))
    let correct = 0

    for (const ans of submission.answers) {
      const expected = cMap.get(ans.questionId)
      if (expected && typeof ans.answer === 'string' && ans.answer.toLowerCase().trim() === expected) {
        correct++
      }
    }

    const accuracy = cards.length > 0 ? correct / cards.length : 0
    const speed = 1 - Math.min(1, submission.totalTimeMs / (content.timeLimit * 1000))
    const total = Math.round((accuracy * 60 + speed * 40) * 100)

    return { score: total, breakdown: { accuracy: Math.round(accuracy * 100), speed: Math.round(speed * 100), total } }
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

export const flashcardSprintEngine = new FlashcardSprintEngine()
