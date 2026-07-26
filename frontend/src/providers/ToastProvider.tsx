import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    const entry: Toast = { ...t, id }
    setToasts(prev => [...prev, entry])
    setTimeout(() => dismiss(id), t.duration ?? 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-24 lg:bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto animate-slide-up rounded-2xl px-5 py-3.5 shadow-xl flex items-start gap-3 min-w-[300px] max-w-[400px]"
            style={{
              background: t.type === 'error' ? '#2d1b1b'
                : t.type === 'success' ? '#0f2e1a'
                : t.type === 'warning' ? '#2d2510'
                : '#1a1d2e',
              border: `1px solid ${
                t.type === 'error' ? 'rgba(239,68,68,0.3)'
                : t.type === 'success' ? 'rgba(34,197,94,0.3)'
                : t.type === 'warning' ? 'rgba(234,179,8,0.3)'
                : 'rgba(99,102,241,0.3)'
              }`,
            }}
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0"
              style={{
                color: t.type === 'error' ? '#ef4444'
                  : t.type === 'success' ? '#22c55e'
                  : t.type === 'warning' ? '#eab308'
                  : '#818cf8',
              }}
            >
              {t.type === 'error' ? 'error' : t.type === 'success' ? 'check_circle' : t.type === 'warning' ? 'warning' : 'info'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{t.title}</p>
              {t.message && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>{t.message}</p>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-on-surface-variant hover:text-on-surface text-lg leading-none flex-shrink-0 material-symbols-outlined">
              close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
