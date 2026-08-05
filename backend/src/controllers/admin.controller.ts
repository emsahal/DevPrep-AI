import { Request, Response, NextFunction } from 'express'
import prisma from '@/utils/prisma'
import { interviewPrepService } from '@/services/interview-prep.service'
import { nvidiaAI } from '@/ai/nvidia.service'
import { getCached, setCache, invalidateCache } from '@/utils/redis'
import { topicContentAI, type TopicGenerationInput } from '@/services/topic-content-ai.service'
import logger from '@/utils/logger'

interface FormatQ {
  number: number
  question: string
  answer: string
}

function buildFormatPrompt(q: FormatQ): string {
  return `You are an expert technical writer creating answers for Instagram interview-prep carousel images (1080x1350px).

QUESTION:
${q.question}

RAW ANSWER:
${q.answer}

Rewrite the answer so it is PERFECT for an image card:
- Be concise, accurate, and interview-grade (max ~130 words).
- If the question compares, contrasts, or asks the difference between 2+ concepts, output a Markdown table comparing them: first column = feature/criteria, then one column per concept.
- Otherwise use short bullet points (- ) and at most one short inline code snippet.
- Use **bold** only for key terms. Never use ***.
- Output ONLY the formatted Markdown answer. No preamble, no heading like "Answer:".`
}

async function formatOne(q: FormatQ): Promise<FormatQ> {
  try {
    const res = await nvidiaAI.generate(
      [{ role: 'user', content: buildFormatPrompt(q) }],
      { temperature: 0.4, maxTokens: 1200 }
    )
    const cleaned = res.content.trim()
    return { ...q, answer: cleaned || q.answer }
  } catch (err) {
    console.error(`[admin] format failed for Q${q.number}:`, err instanceof Error ? err.message : err)
    return q
  }
}

async function formatInParallel(questions: FormatQ[], concurrency = 3): Promise<FormatQ[]> {
  const queue = [...questions]
  const results: FormatQ[] = []
  let cursor = 0

  async function worker() {
    while (cursor < queue.length) {
      const q = queue[cursor]
      cursor++
      const formatted = await formatOne(q)
      results.push(formatted)
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker))
  return results.sort((a, b) => a.number - b.number)
}

export class AdminController {
  async getQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const quizzes = await prisma.quiz.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true } },
          topic: { select: { id: true, title: true, slug: true } },
        },
      })
      res.json(quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        topic: q.topic,
        questionCount: q._count.questions,
        createdAt: q.createdAt,
      })))
    } catch (error) {
      next(error)
    }
  }

  async getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await prisma.quiz.findUnique({
        where: { id: req.params.id },
        include: {
          topic: { select: { id: true, title: true, slug: true } },
          questions: { orderBy: { order: 'asc' } },
        },
      })
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
      res.json(quiz)
    } catch (error) {
      next(error)
    }
  }

  async getInterviewTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = await interviewPrepService.getTopics()
      res.json(topics)
    } catch (error) {
      next(error)
    }
  }

  async getInterviewQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await interviewPrepService.getQuestionsBySlug(req.params.slug)
      if (!topic) return res.status(404).json({ message: 'Topic not found' })
      res.json(topic)
    } catch (error) {
      next(error)
    }
  }

  async formatInterviewAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug
      const topic = await interviewPrepService.getQuestionsBySlug(slug)
      if (!topic) return res.status(404).json({ message: 'Topic not found' })

      const cacheKey = `admin:interview-format:${slug}`
      const cached = await getCached<{ slug: string; name: string; questions: FormatQ[] }>(cacheKey)
      if (cached) {
        res.json(cached)
        return
      }

      const questions = await formatInParallel(topic.questions.map((q) => ({
        number: q.number,
        question: q.question,
        answer: q.answer,
      })))

      const result = { slug, name: topic.name, questions }
      await setCache(cacheKey, result, 60 * 60 * 24 * 7)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async regenerateTopicContent(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await prisma.topic.findUnique({
        where: { slug: req.params.slug },
        include: { technology: { select: { id: true, name: true } } },
      })
      if (!topic) return res.status(404).json({ message: 'Topic not found' })

      const input: TopicGenerationInput = {
        id: topic.id,
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        difficulty: topic.difficulty,
        category: topic.category,
        technologyName: topic.technology?.name,
      }

      const { roman, english, errors } = await topicContentAI.generateAndValidate(input)
      if (errors.length > 0) {
        return res.status(502).json({ message: 'AI generation produced invalid content. Please try again.', errors })
      }

      const content = topicContentAI.buildBilingualContent(input, roman, english)
      const updated = await prisma.topic.update({
        where: { id: topic.id },
        data: { content, aiGenerated: true, aiGeneratedAt: new Date() },
      })
      await invalidateCache(`topic:${topic.slug}`)
      logger.info(`[Admin] regenerated AI content for "${updated.title}"`)

      res.json({
        success: true,
        topic: {
          id: updated.id,
          slug: updated.slug,
          title: updated.title,
          content: updated.content,
          aiGenerated: updated.aiGenerated,
          aiGeneratedAt: updated.aiGeneratedAt,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export const adminController = new AdminController()
