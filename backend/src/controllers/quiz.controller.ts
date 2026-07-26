import { Request, Response, NextFunction } from 'express'
import prisma from '@/utils/prisma'
import { quizService } from '@/services/quiz.service'
import { gamificationService } from '@/services/gamification.service'
import type { AuthRequest } from '@/middleware/auth'
import { nvidiaAI } from '@/ai/nvidia.service'

class QuestionStreamParser {
  private buffer = ''
  private braceCount = 0
  private inString = false
  private escapeNext = false
  private onQuestion: (question: any) => void

  constructor(onQuestion: (question: any) => void) {
    this.onQuestion = onQuestion
  }

  feed(chunk: string) {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i]
      this.buffer += char

      if (this.escapeNext) {
        this.escapeNext = false
        continue
      }

      if (char === '\\') {
        this.escapeNext = true
        continue
      }

      if (char === '"') {
        this.inString = !this.inString
        continue
      }

      if (!this.inString) {
        if (char === '{') {
          if (this.braceCount === 0) {
            this.buffer = '{'
          }
          this.braceCount++
        } else if (char === '}') {
          this.braceCount--
          if (this.braceCount === 0) {
            try {
              const question = JSON.parse(this.buffer)
              if (
                question &&
                typeof question.text === 'string' &&
                Array.isArray(question.options) &&
                question.options.length === 4
              ) {
                this.onQuestion(question)
              }
            } catch (e) {
              // ignore parse errors for partial/incomplete JSON
            }
            this.buffer = ''
          }
        }
      }
    }
  }
}

export class QuizController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const topicId = req.query.topicId as string | undefined
      const quizzes = await quizService.getAll({ page, limit, topicId })
      res.json(quizzes)
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await quizService.getById(req.params.id)
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }

  async streamById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: { orderBy: { order: 'asc' } },
          topic: { select: { id: true, title: true, slug: true } },
        },
      })
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')

      // Check if it's placeholder/templated or empty
      const isPlaceholder = quiz.questions.length === 0 || 
        (quiz.questions[0] && (quiz.questions[0].text.includes('mainly about?') || quiz.questions[0].text.includes('In simple words')));

      if (!isPlaceholder) {
        // Send existing questions instantly
        for (const q of quiz.questions) {
          res.write(`data: ${JSON.stringify({ type: 'question', question: q })}\n\n`)
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
        res.end()
        return
      }

      const difficultyInstruction =
        quiz.difficulty === 'mixed'
          ? 'Mix easy, intermediate, and hard questions.'
          : `All questions should be ${quiz.difficulty} level.`

      const prompt = `You are an expert technical interviewer and software staff engineer.
Generate exactly 15 high-quality multiple-choice questions (MCQs) for the topic "${quiz.topic?.title || 'this topic'}".
These questions must be realistic, challenging, and suitable for technical interview preparation at top tech companies.

CRITICAL INSTRUCTIONS:
1. NO PLACEHOLDERS: Do not use template questions. Every question must be distinct and explore specific technical mechanics.
2. REAL-WORLD CODE: Include code snippets or mock output scenarios in at least 5 questions.
3. TOPIC DEPTH: Cover deep, practical concepts (syntax, execution steps, performance characteristics, memory, common edge cases, errors).
4. QUALITY OPTIONS: Ensure options are realistic distractors.
5. EXPLANATIONS: Provide clear, technical, step-by-step explanations of why the correct option is right.

${difficultyInstruction}

IMPORTANT: Return ONLY a valid JSON array. Do not wrap it in markdown code blocks. No text before or after the JSON.
Format:
[
  {
    "text": "Detailed, specific question testing a concept or code snippet.",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Thorough technical explanation...",
    "difficulty": "intermediate"
  }
]`

      const generatedQuestions: any[] = []
      const parser = new QuestionStreamParser((question) => {
        const formatted = {
          id: `ai-${generatedQuestions.length}`,
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          order: generatedQuestions.length + 1,
        }
        generatedQuestions.push(formatted)
        res.write(`data: ${JSON.stringify({ type: 'question', question: formatted })}\n\n`)
      })

      await nvidiaAI.generateStream(
        [{ role: 'user', content: prompt }],
        (chunk) => {
          parser.feed(chunk)
        },
        { temperature: 0.75, maxTokens: 8192 }
      )

      if (generatedQuestions.length >= 5) {
        prisma.$transaction(async (tx) => {
          await tx.question.deleteMany({ where: { quizId: id } })
          await tx.question.createMany({
            data: generatedQuestions.map((q, idx) => ({
              quizId: id,
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: idx + 1,
            }))
          })
        }).then(async () => {
          const { invalidateCache } = await import('@/utils/redis')
          await invalidateCache(`quiz:${id}`)
        }).catch((err) => {
          console.error('Failed to save generated quiz in transaction:', err)
        })
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
      res.end()
    } catch (error) {
      if (!res.headersSent) {
        next(error)
      }
    }
  }

  async testNvidia(req: Request, res: Response, next: NextFunction) {
    try {
      const apiKey = process.env.NVIDIA_API_KEY || ''
      const url = 'https://integrate.api.nvidia.com/v1/chat/completions'
      
      const payload = {
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'user',
            content: 'Hello, respond with: "Nvidia API test successful!"'
          }
        ],
        temperature: 1,
        max_tokens: 1024,
      }

      console.log('Testing Nvidia API with key:', apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING')
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const status = response.status
      const statusText = response.statusText
      const body = await response.text()

      res.json({
        status,
        statusText,
        body
      })
    } catch (err: any) {
      res.json({
        error: err.message,
        stack: err.stack
      })
    }
  }

  async getDaily(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quiz = await quizService.getDailyQuiz()
      if (!quiz) return res.status(404).json({ message: 'No quiz available' })
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }

  async submitAttempt(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { answers } = req.body
      const quiz = await prisma.quiz.findUnique({ where: { id }, select: { difficulty: true } })
      const difficulty = quiz?.difficulty || 'beginner'
      const result = await quizService.submitAttempt(req.userId!, id, answers)
      gamificationService.handleQuizCompleted(req.userId!, id, result.score, difficulty).catch(() => {})
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getAttempts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const quizId = req.query.quizId as string | undefined
      const attempts = await quizService.getAttempts(req.userId!, { quizId, page, limit })
      res.json(attempts)
    } catch (error) {
      next(error)
    }
  }

  async generateAIQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { topicId, customTopic, questionCount = 15, difficulty = 'mixed', quizType = 'custom' } = req.body
      const count = Math.min(Math.max(parseInt(String(questionCount), 10) || 15, 15), 40)
      if (!customTopic && !topicId) return res.status(400).json({ message: 'topicId or customTopic is required' })
      const quiz = customTopic
        ? await quizService.generateCustomAIQuiz(String(customTopic), count, difficulty, quizType)
        : await quizService.generateAIQuiz(topicId, count, difficulty)
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }
}

export const quizController = new QuizController()
