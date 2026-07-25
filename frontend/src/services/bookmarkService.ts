import api from '@/lib/axios'

export interface BookmarkItem {
  id: string
  type: 'topic' | 'note' | 'flashcard'
  createdAt: string
  item: {
    id: string
    title: string
    slug?: string
    description?: string
    difficulty?: string
    technology?: { id: string; name: string; slug: string }
    type?: string
    topic?: { id: string; title: string; slug: string }
  }
}

export const bookmarkService = {
  async getAll(): Promise<BookmarkItem[]> {
    const { data } = await api.get('/bookmarks')
    return data
  },

  async toggle(type: string, itemId: string): Promise<{ bookmarked: boolean }> {
    const { data } = await api.post('/bookmarks/toggle', { type, itemId })
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/bookmarks/${id}`)
  },
}
