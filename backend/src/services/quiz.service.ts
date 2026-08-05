import prisma from '@/utils/prisma'
import { getCached, invalidateCache, setCache } from '@/utils/redis'
import { AppError } from '@/middleware/errorHandler'
import { nvidiaAI } from '@/ai/nvidia.service'
import logger from '@/utils/logger'
import { slugify } from '@/utils/helpers'
import { normalizePagination, createPaginatedResult } from '@/utils/pagination'

type AIQuizQuestion = {
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty?: string
}

export class QuizService {
  async getAll(params: { page?: number; limit?: number; topicId?: string } = {}) {
    const { page = 1, limit = 20, topicId } = params
    const pagination = { page, limit }
    const { skip, take } = { skip: (pagination.page - 1) * pagination.limit, take: pagination.limit + 1 }
    const cacheKey = `quizzes:all:${topicId || 'all'}:page:${pagination.page}:limit:${pagination.limit}`

    const cached = await getCached(cacheKey)
    if (cached) return cached

    const where = topicId ? { topicId } : {}
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          _count: { select: { questions: true } },
          topic: { select: { id: true, title: true, slug: true } },
        },
      }),
      prisma.quiz.count(),
    ])

    const hasNext = quizzes.length > pagination.limit
    const data = hasNext ? quizzes.slice(0, pagination.limit) : quizzes

    const result = {
      data: data.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        passingScore: q.passingScore,
        isDaily: q.isDaily,
        questionCount: q._count.questions,
        topic: q.topic,
        createdAt: q.createdAt,
      })),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext,
        hasPrev: pagination.page > 1,
      },
    }

    await setCache(cacheKey, result, 300)
    return result
  }

  async getById(id: string) {
    const cacheKey = `quiz:${id}`
    const cached = await getCached(cacheKey)
    if (cached) return cached

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        topic: { select: { id: true, title: true, slug: true } },
      },
    })

    if (!quiz) return null

    // Check if it's placeholder/templated
    const isPlaceholder = quiz.questions.length > 0 && 
      (quiz.questions[0].text.includes('mainly about?') || quiz.questions[0].text.includes('In simple words'));

    if (isPlaceholder) {
      const result = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        isDaily: quiz.isDaily,
        topic: quiz.topic,
        isPlaceholder: true,
        questions: [],
      }
      return result
    }

    const result = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      isDaily: quiz.isDaily,
      topic: quiz.topic,
      isPlaceholder: false,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        order: q.order,
      })),
    }

    await setCache(cacheKey, result, 300)
    return result
  }

  async submitAttempt(userId: string, quizId: string, answers: Array<{ questionId: string; selectedAnswer: number }>) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true, topic: true },
    })

    if (!quiz) throw new AppError(404, 'Quiz not found')

    let score = 0
    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]))

    const gradedAnswers = answers.map((answer) => {
      const question = questionMap.get(answer.questionId)
      if (!question) return null

      const isCorrect = answer.selectedAnswer === question.correctAnswer
      if (isCorrect) score++

      return {
        questionId: answer.questionId,
        questionText: question.text,
        options: question.options,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      }
    }).filter(Boolean) as any[]

    const totalQuestions = quiz.questions.length
    const percentage = Math.round((score / totalQuestions) * 100)

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score: percentage,
        answers: gradedAnswers,
        completed: true,
        completedAt: new Date(),
      },
    })

    if (quiz.topicId) {
      const existingProgress = await prisma.userProgress.findUnique({
        where: { userId_topicId: { userId, topicId: quiz.topicId } },
      })

      const hasPassedQuiz = percentage >= 75
      const completed = hasPassedQuiz

      await prisma.userProgress.upsert({
        where: { userId_topicId: { userId, topicId: quiz.topicId } },
        update: {
          score: Math.max(existingProgress?.score || 0, percentage),
          hasRead: existingProgress?.hasRead || hasPassedQuiz,
          completed: existingProgress?.completed || completed,
        },
        create: {
          userId,
          topicId: quiz.topicId,
          score: percentage,
          completed,
          hasRead: hasPassedQuiz,
        },
      })

      if (completed && !existingProgress?.completed) {
        const { gamificationService } = await import('./gamification.service')
        await gamificationService.handleTopicCompleted(userId, quiz.topicId, quiz.topic.difficulty)
      }
    }

    return {
      id: attempt.id,
      score: percentage,
      passed: percentage >= quiz.passingScore,
      totalQuestions,
      correctAnswers: score,
      answers: gradedAnswers,
      completedAt: attempt.completedAt,
    }
  }

  async getAttempts(userId: string, params: { quizId?: string; page?: number; limit?: number } = {}) {
    const pagination = { page: params.page ?? 1, limit: params.limit ?? 20 }
    const { skip, take } = { skip: (pagination.page - 1) * pagination.limit, take: pagination.limit + 1 }

    const where = params.quizId ? { userId, quizId: params.quizId } : { userId }
    const [attempts, total] = await Promise.all([
      prisma.quizAttempt.findMany({
        where,
        orderBy: { completedAt: 'desc' },
        skip,
        take,
        include: {
          quiz: {
            select: { id: true, title: true, difficulty: true, passingScore: true },
          },
        },
      }),
      prisma.quizAttempt.count({ where }),
    ])

    const hasNext = attempts.length > pagination.limit
    const data = hasNext ? attempts.slice(0, pagination.limit) : attempts

    return {
      data: data.map((a) => ({
        id: a.id,
        quizId: a.quizId,
        quizTitle: a.quiz.title,
        difficulty: a.quiz.difficulty,
        score: a.score,
        passed: a.score >= a.quiz.passingScore,
        totalQuestions: a.answers ? (a.answers as Array<unknown>).length : 0,
        completedAt: a.completedAt,
      })),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext,
        hasPrev: pagination.page > 1,
      },
    }
  }

  async getDailyQuiz() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const quiz = await prisma.quiz.findFirst({
      where: { isDaily: true },
      include: {
        questions: { orderBy: { order: 'asc' } },
        topic: { select: { id: true, title: true, slug: true } },
      },
    })

    if (!quiz) {
      const anyQuiz = await prisma.quiz.findFirst({
        include: {
          questions: { orderBy: { order: 'asc' }, take: 5 },
          topic: { select: { id: true, title: true, slug: true } },
        },
      })
      return anyQuiz
    }

    return quiz
  }
  private parseAIQuestions(content: string, questionCount: number): AIQuizQuestion[] {
    const cleaned = content
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed)) throw new Error('Not an array')

    return parsed.slice(0, questionCount).map((q, index) => {
      if (
        typeof q.text !== 'string' ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== 'number'
      ) {
        throw new Error(`Invalid question at index ${index}`)
      }

      return {
        text: q.text,
        options: q.options.map(String),
        correctAnswer: Math.min(Math.max(q.correctAnswer, 0), 3),
        explanation: String(q.explanation || 'Review the topic explanation for the reasoning.'),
        difficulty: typeof q.difficulty === 'string' ? q.difficulty : undefined,
      }
    })
  }

  private async createQuizFromAI(params: {
    title: string
    description: string
    topicId: string
    topicTitle: string
    topicDescription: string
    technologyName: string
    questionCount: number
    difficulty: string
    quizType?: string
  }) {
    const difficultyInstruction =
      params.difficulty === 'mixed'
        ? 'Mix easy, intermediate, and hard questions.'
        : `All questions should be ${params.difficulty} level.`

    const typeInstruction = params.quizType
      ? `Quiz type: ${params.quizType}. If it is "mega", include broader coverage and practical scenario questions.`
      : ''

    const prompt = `You are an expert software engineering interview coach.
Generate exactly ${params.questionCount} multiple-choice questions about "${params.topicTitle}" (${params.technologyName}).
${difficultyInstruction}
${typeInstruction}
Topic description/context: ${params.topicDescription}

IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanation outside JSON.
Format:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this answer is correct.",
    "difficulty": "easy"
  }
]
- correctAnswer is the 0-based index of the correct option
- Each question must have exactly 4 options
- Questions must be practical, interview-relevant, and not repetitive`

    const response = await nvidiaAI.generate(
      [{ role: 'user', content: prompt }],
      { temperature: 0.75, maxTokens: 8192 }
    )

    let questions: AIQuizQuestion[]
    try {
      questions = this.parseAIQuestions(response.content, params.questionCount)
    } catch {
      throw new AppError(500, 'AI returned invalid quiz format. Please try again.')
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: params.title,
        description: params.description,
        difficulty: params.difficulty,
        timeLimit: Math.max(params.questionCount, 15) * 60,
        passingScore: 70,
        isDaily: false,
        topicId: params.topicId,
        questions: {
          create: questions.map((q, index) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: index + 1,
          })),
        },
      },
      include: {
        topic: { select: { id: true, title: true, slug: true } },
        questions: { orderBy: { order: 'asc' } },
      },
    })

    await invalidateCache('quizzes:all:*')

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      isDaily: quiz.isDaily,
      topic: quiz.topic,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        order: q.order,
      })),
    }
  }

  async getOrGenerateQuizForTopic(slug: string, questionCount: number = 15) {
    const topic = await prisma.topic.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        difficulty: true,
        technology: { select: { name: true } },
      },
    })
    if (!topic) throw new AppError(404, 'Topic not found')

    const existing = await prisma.quiz.findFirst({
      where: { topicId: topic.id },
      orderBy: { createdAt: 'desc' },
      include: {
        topic: { select: { id: true, title: true, slug: true } },
        questions: { orderBy: { order: 'asc' } },
      },
    })

    const isPlaceholder =
      existing &&
      existing.questions.length > 0 &&
      (existing.questions[0].text.includes('mainly about?') || existing.questions[0].text.includes('In simple words'))

    if (existing && !isPlaceholder && existing.questions.length > 0) {
      return {
        id: existing.id,
        title: existing.title,
        description: existing.description,
        difficulty: existing.difficulty,
        timeLimit: existing.timeLimit,
        passingScore: existing.passingScore,
        isDaily: existing.isDaily,
        topic: existing.topic,
        questions: existing.questions.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          order: q.order,
        })),
      }
    }

    return this.generateAIQuiz(topic.id, questionCount, topic.difficulty)
  }

  async generateAIQuiz(topicId: string, questionCount: number = 15, difficulty: string = 'mixed') {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true, title: true, description: true, content: true, technology: { select: { name: true } } },
    })
    if (!topic) throw new AppError(404, 'Topic not found')

    return this.createQuizFromAI({
      title: `AI Quiz: ${topic.title}`,
      description: `AI-generated ${difficulty} quiz on ${topic.title} with ${questionCount} questions.`,
      topicId: topic.id,
      topicTitle: topic.title,
      topicDescription: `${topic.description}\n\n${topic.content.slice(0, 4000)}`,
      technologyName: topic.technology?.name || 'Software Engineering',
      questionCount,
      difficulty,
    })
  }

  async generateCustomAIQuiz(customTopic: string, questionCount: number = 15, difficulty: string = 'mixed', quizType: string = 'custom') {
    const cleanTopic = customTopic.trim()
    if (cleanTopic.length < 2) throw new AppError(400, 'customTopic is required')

    const technology = await prisma.technology.upsert({
      where: { slug: 'custom-ai' },
      update: {},
      create: {
        name: 'Custom AI',
        slug: 'custom-ai',
        description: 'AI-generated custom interview practice topics.',
        category: 'other',
        icon: 'auto_awesome',
        color: '#d0bcff',
        order: 999,
      },
    })

    const slug = `custom-${slugify(cleanTopic)}`
    const topic = await prisma.topic.upsert({
      where: { slug },
      update: {
        title: cleanTopic,
        description: `Custom AI-generated quiz topic: ${cleanTopic}.`,
        technologyId: technology.id,
      },
      create: {
        title: cleanTopic,
        slug,
        description: `Custom AI-generated quiz topic: ${cleanTopic}.`,
        content: `# ${cleanTopic}\n\nThis topic was created from a custom AI quiz request.`,
        category: technology.category,
        technologyId: technology.id,
        difficulty: difficulty === 'mixed' ? 'intermediate' : difficulty,
        order: 999,
      },
    })

    return this.createQuizFromAI({
      title: `${quizType === 'mega' ? 'Mega' : 'Custom'} Quiz: ${cleanTopic}`,
      description: `AI-generated ${quizType} quiz for "${cleanTopic}" with ${questionCount} questions.`,
      topicId: topic.id,
      topicTitle: cleanTopic,
      topicDescription: `Create a practical learning and interview quiz about ${cleanTopic}. Include definitions, real-world use, code behavior, debugging, edge cases, and best practices.`,
      technologyName: 'Software Engineering',
      questionCount,
      difficulty,
      quizType,
    })
  }
}

export const quizService = new QuizService()