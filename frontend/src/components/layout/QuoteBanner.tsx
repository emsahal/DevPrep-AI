import { useMemo } from 'react'

const QUOTES = [
  'The expert in anything was once a beginner.',
  'Code is like humor. When you have to explain it, it\u2019s bad.',
  'Simplicity is the soul of efficiency.',
  'An investment in knowledge pays the best interest.',
  'The best way to predict the future is to create it.',
  'Practice isn\u2019t the thing you do once you\u2019re good. It\u2019s the thing you do that makes you good.',
  'Success is the sum of small efforts, repeated day in and day out.',
  'Learning never exhausts the mind.',
  'The only way to do great work is to love what you do.',
  'Fall seven times, stand up eight.',
  'Knowledge is power, but enthusiasm pulls the switch.',
  'The beautiful thing about learning is no one can take it away from you.',
]

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

interface QuoteBannerProps {
  visible: boolean
  onClose: () => void
}

export function QuoteBanner({ visible, onClose }: QuoteBannerProps) {
  const quote = useMemo(() => QUOTES[dayOfYear(new Date()) % QUOTES.length], [])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[55] flex items-center justify-center"
      style={{
        height: '40px',
        padding: '0 44px',
        background:
          'linear-gradient(90deg, rgba(139,92,246,0.28) 0%, rgba(76,215,246,0.12) 50%, rgba(139,92,246,0.28) 100%)',
        borderBottom: '1px solid rgba(208,188,255,0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="material-symbols-outlined shrink-0"
        style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1", fontSize: '16px' }}
      >
        auto_awesome
      </span>
      <p
        className="text-[13px] font-medium truncate ml-2"
        style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <button
        type="button"
        onClick={onClose}
        title="Dismiss quote"
        aria-label="Dismiss quote"
        className="absolute right-2.5 flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:bg-white/10 active:scale-95"
        style={{ color: 'var(--color-on-surface-variant)' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>
    </div>
  )
}