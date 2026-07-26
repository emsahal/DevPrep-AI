import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationService, Notification } from '@/services/notificationService'

export function NotificationDropdown() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUnread()
    const interval = setInterval(loadUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const loadUnread = async () => {
    try {
      const res = await notificationService.getUnread()
      setNotifications(res.data)
      setUnreadCount(res.data.length)
    } catch { /* ignore */ }
  }

  const markRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      loadUnread()
    } catch { /* ignore */ }
  }

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      loadUnread()
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
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative p-2 rounded-xl hover:bg-surface-container-low transition-colors"
              style={{ color: 'var(--color-on-surface-variant)' }}>
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 rounded-2xl shadow-xl overflow-hidden z-50"
             style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-outline-variant)' }}>
          <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--color-outline-variant)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium underline"
                      style={{ color: 'var(--color-primary)' }}>
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id) }}
                  className="w-full flex items-start gap-3 p-3 text-left hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined mt-0.5" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>
                    {icon(n.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-on-surface)' }}>{n.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-on-surface-variant)' }}>{n.body}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-2 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
            <button onClick={() => { setOpen(false); navigate('/notifications') }}
                    className="w-full py-2 rounded-xl text-xs font-medium hover:bg-surface-container-low transition-colors"
                    style={{ color: 'var(--color-on-surface-variant)' }}>
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
