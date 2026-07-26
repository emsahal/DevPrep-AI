import prisma from '@/utils/prisma'

export class NotificationService {
  async create(userId: string, type: string, title: string, body: string, data?: Record<string, unknown>) {
    const notification = await prisma.notification.create({
      data: { userId, type, title, body, data: data ? JSON.parse(JSON.stringify(data)) : undefined },
    })
    return notification
  }

  async getUnread(userId: string, page = 1, limit = 20) {
    const where = { userId, isRead: false }
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.notification.count({ where }),
    ])
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async getAll(userId: string, page = 1, limit = 20) {
    const where = { userId }
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.notification.count({ where }),
    ])
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    })
    if (!notif) return null
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  }
}

export const notificationService = new NotificationService()
