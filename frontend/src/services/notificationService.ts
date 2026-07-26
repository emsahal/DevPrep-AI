import api from '@/lib/axios'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  body: string
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export const notificationService = {
  async getAll(page = 1, limit = 20): Promise<{ data: Notification[]; pagination: unknown }> {
    const { data } = await api.get('/notifications', { params: { page, limit } })
    return data
  },

  async getUnread(): Promise<{ data: Notification[]; pagination: unknown }> {
    const { data } = await api.get('/notifications/unread')
    return data
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`)
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all')
  },
}
