import prisma from '@/utils/prisma'
import { nvidiaAI } from '@/ai/nvidia.service'
import { AppError } from '@/middleware/errorHandler'
import { getCached, setCache } from '@/utils/redis'

const REVISION_PROMPT = `You are an expert at creating revision materials. Generate comprehensive revision content for the following topic.

Topic: {title}
Description: {description}

Create a structured revision guide with:
1. Key Concepts (bullet points)
2. Important Definitions
3. Code Snippets (if applicable)
4. Common Patterns
5. Quick Tips
6. Common Pitfalls to Avoid

Format with clear headers and bullet points for quick scanning.`

const SUMMARY_PROMPT = `You are an expert at creating concise summaries. Summarize the following topic in 3-4 short paragraphs. Focus only on the most important points that someone needs to know for an interview.

Topic: {title}
Description: {description}

Keep it extremely concise - this is for quick revision.`

const CHEAT_SHEET_PROMPT = `You are an expert at creating cheat sheets. Create a one-page cheat sheet for the following topic. Use minimal words, maximum information. Include:
- Key syntax/commands
- Important patterns
- Quick reference tables where helpful
- Must-remember points

Topic: {title}
Description: {description}

Format for quick visual scanning.`

export class RevisionService {
  async getAll(userId: string, type?: string) {
    const where = { userId } as Record<string, unknown>
    if (type) where.type = type

    const notes = await prisma.revisionNote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        topic: { select: { id: true, title: true, slug: true } },
      },
    })

    return notes.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      summary: n.summary,
      type: n.type,
      tags: n.tags,
      createdAt: n.createdAt,
      topic: n.topic,
    }))
  }

  async generate(userId: string, topicId: string, type: 'note' | 'summary' | 'cheat-sheet') {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { technology: { select: { name: true } } },
    })
    if (!topic) throw new AppError(404, 'Topic not found')

    const cacheKey = `revision:gen:${topicId}:${type}`
    const cached = await getCached<{ content: string }>(cacheKey)
    if (cached) return { content: cached.content, fromCache: true }

    const prompt = type === 'note' ? REVISION_PROMPT
      : type === 'summary' ? SUMMARY_PROMPT
      : CHEAT_SHEET_PROMPT

    const fullPrompt = prompt
      .replace('{title}', topic.title)
      .replace('{description}', topic.description)

    const response = await nvidiaAI.generate([
      { role: 'system', content: 'You are an expert software engineering revision assistant. Generate clear, accurate revision materials.' },
      { role: 'user', content: fullPrompt },
    ], { temperature: 0.3, maxTokens: 2048 })

    const note = await prisma.revisionNote.create({
      data: {
        title: `${type === 'cheat-sheet' ? 'Cheat Sheet' : type === 'summary' ? 'Summary' : 'Notes'} - ${topic.title}`,
        content: response.content,
        summary: type === 'summary' ? response.content.substring(0, 500) : null,
        type,
        tags: [topic.technology.name, topic.title],
        topicId,
        userId,
      },
    })

    await setCache(cacheKey, { content: response.content }, 86400)

    return {
      id: note.id,
      title: note.title,
      content: note.content,
      type: note.type,
      tags: note.tags,
      createdAt: note.createdAt,
      topic: { id: topic.id, title: topic.title, slug: topic.slug },
    }
  }

  async getTopicsForRevision() {
    const topics = await prisma.topic.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        technology: { select: { id: true, name: true, slug: true } },
      },
    })
    return topics
  }

  async delete(userId: string, noteId: string) {
    const note = await prisma.revisionNote.findUnique({ where: { id: noteId } })
    if (!note) throw new AppError(404, 'Note not found')
    if (note.userId !== userId) throw new AppError(403, 'Not authorized')

    await prisma.revisionNote.delete({ where: { id: noteId } })
  }
}

export const revisionService = new RevisionService()
