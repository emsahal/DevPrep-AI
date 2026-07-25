import prisma from '@/utils/prisma'
import { AppError } from '@/middleware/errorHandler'

export class BookmarkService {
  async getAll(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const topicIds = bookmarks.filter((b) => b.type === 'topic' && b.topicId).map((b) => b.topicId!)
    const noteIds = bookmarks.filter((b) => b.type === 'note' && b.noteId).map((b) => b.noteId!)

    const [topics, notes] = await Promise.all([
      prisma.topic.findMany({
        where: { id: { in: topicIds } },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          difficulty: true,
          technology: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.revisionNote.findMany({
        where: { id: { in: noteIds } },
        select: {
          id: true,
          title: true,
          type: true,
          topic: { select: { id: true, title: true, slug: true } },
        },
      }),
    ])

    const topicMap = new Map(topics.map((t) => [t.id, t]))
    const noteMap = new Map(notes.map((n) => [n.id, n]))

    return bookmarks.map((b) => ({
      id: b.id,
      type: b.type,
      createdAt: b.createdAt,
      item: b.type === 'topic'
        ? topicMap.get(b.topicId!)
        : b.type === 'note'
        ? noteMap.get(b.noteId!)
        : null,
    })).filter((b) => b.item)
  }

  async toggle(userId: string, type: 'topic' | 'note' | 'flashcard', itemId: string) {
    const existing = await prisma.bookmark.findFirst({
      where: { userId, type, OR: [
        { topicId: type === 'topic' ? itemId : undefined },
        { noteId: type === 'note' ? itemId : undefined },
        { flashCardId: type === 'flashcard' ? itemId : undefined },
      ].filter(Boolean) as Array<{ topicId?: string; noteId?: string; flashCardId?: string }> },
    })

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
      return { bookmarked: false }
    }

    await prisma.bookmark.create({
      data: {
        userId,
        type,
        topicId: type === 'topic' ? itemId : undefined,
        noteId: type === 'note' ? itemId : undefined,
        flashCardId: type === 'flashcard' ? itemId : undefined,
      },
    })

    return { bookmarked: true }
  }

  async delete(userId: string, bookmarkId: string) {
    const bookmark = await prisma.bookmark.findUnique({ where: { id: bookmarkId } })
    if (!bookmark) throw new AppError(404, 'Bookmark not found')
    if (bookmark.userId !== userId) throw new AppError(403, 'Not authorized')
    await prisma.bookmark.delete({ where: { id: bookmarkId } })
  }
}

export const bookmarkService = new BookmarkService()
