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

export class QuizBattleEngine implements DuelEngine {
  async generate(mode: string, topic: string): Promise<DuelGameContent> {
    const quizzes = await prisma.quiz.findMany({
      where: {
        topic: topic !== 'any' ? { slug: topic } : undefined,
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
      take: 5,
    })

    const allQuestions = quizzes.flatMap(q => q.questions.map(qn => ({
      id: qn.id,
      text: qn.text,
      options: qn.options,
      correctAnswer: qn.correctAnswer,
      timeLimit: 30,
    })))

    const selected = shuffleArray(allQuestions).slice(0, 10)

    return {
      type: 'quiz',
      questions: selected,
      timeLimit: selected.length * 30,
    }
  }

  score(content: DuelGameContent, submission: PlayerSubmission): ScoredResult {
    const questions = content.questions as Array<{ id: string; correctAnswer: number }>
    let correct = 0
    const qMap = new Map(questions.map(q => [q.id, q]))

    for (const ans of submission.answers) {
      const q = qMap.get(ans.questionId)
      if (q && ans.answer === q.correctAnswer) correct++
    }

    const accuracy = questions.length > 0 ? correct / questions.length : 0
    const timeRatio = Math.max(0, 1 - submission.totalTimeMs / (content.timeLimit * 1000))
    const speed = 1 - Math.min(1, submission.totalTimeMs / (content.timeLimit * 1000))
    const total = Math.round((accuracy * 70 + speed * 30) * 100)

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

export const quizBattleEngine = new QuizBattleEngine()
