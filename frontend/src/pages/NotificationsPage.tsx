import { useState, useEffect } from 'react'
import { notificationService } from '@/services/notificationService'
import type { Notification } from '@/services/notificationService'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page] = useState(1)

  useEffect(() => {
    load()
  }, [page])

  const load = async () => {
    try {
      const res = await notificationService.getAll(page)
      setNotifications(res.data)
    } catch { /* ignore */ }
  }

  const markRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      load()
    } catch { /* ignore */ }
  }

  const icon = (type: string) => {
    switch (type) {
      case 'duel_invite': return 'sports_esports'
      case 'duel_result': return 'emoji_events'
      case 'duel_accepted': return 'handshake'
      default: return 'notifications'
    }
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto animate-fade-up">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8" style={{ color: 'var(--color-on-surface)' }}>
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <span className="material-symbols-outlined text-5xl mb-3" style={{ color: 'var(--color-outline)' }}>notifications_off</span>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="bento-card p-4 flex items-start gap-3"
                 onClick={() => { if (!n.isRead) markRead(n.id) }}
                 style={{ opacity: n.isRead ? 0.7 : 1, cursor: n.isRead ? 'default' : 'pointer' }}>
              <span className="material-symbols-outlined mt-0.5" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>
                {icon(n.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{n.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>{n.body}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--color-outline)' }}>
                  {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: 'var(--color-primary)' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
