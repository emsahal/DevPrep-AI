import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { flashcardService } from '@/services/flashcardService'


export function FlashcardsPage() {
  const [page, setPage] = useState(1)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState<number[]>([])

  const { data: response, isLoading } = useQuery<any>({
    queryKey: ['flashcards', page],
    queryFn: () => flashcardService.getAll({ page, limit: 20 }),
  })

  const cards = response?.data ?? []
  const pagination = response?.pagination
  const totalCards = pagination?.total ?? 0

  const reviewMutation = useMutation({
    mutationFn: ({ id, quality }: { id: string; quality: number }) =>
      flashcardService.reviewCard(id, quality),
  })

  const card = cards[idx]
  const progress = cards.length > 0 ? Math.round((done.length / totalCards) * 100) : 0

  const next = (knew: boolean) => {
    if (card && knew && !done.includes(idx)) {
      setDone(d => [...d, idx])
      reviewMutation.mutate({ id: card.id, quality: knew ? 4 : 1 })
    }
    setFlipped(false)
    setTimeout(() => {
      setIdx(i => (i + 1) % cards.length)
    }, 150)
  }

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>style</span>
        <p style={{ color: 'var(--color-outline)' }}>No flashcards available yet.</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>Flashcards</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Spaced-repetition review to lock in key concepts.</p>
      </div>

      <div className="bento-card p-5 mb-6 animate-fade-up animation-delay-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>Session Progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{done.length} / {totalCards} mastered</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-container-high)' }}>
          <div className="h-full rounded-full progress-glow transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--color-primary)' }} />
        </div>
      </div>

      <div className="animate-fade-up animation-delay-200" style={{ perspective: '1000px' }}>
        <div
          onClick={() => setFlipped(f => !f)}
          className="relative w-full cursor-pointer select-none transition-transform duration-500"
          style={{
            minHeight: '260px',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
               style={{ backfaceVisibility: 'hidden', border: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-lowest)' }}>
            <span className="pill mb-2" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}>{card.topic?.title || 'General'}</span>
            <span className="pill mb-4" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>{card.difficulty}</span>
            <p className="text-xl font-bold leading-snug" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>{card.front}</p>
            <p className="text-xs mt-5" style={{ color: 'var(--color-outline)' }}>Tap to reveal answer</p>
          </div>
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', border: '1px solid rgba(208,188,255,0.25)', background: 'rgba(208,188,255,0.05)' }}>
            <span className="material-symbols-outlined text-4xl mb-4" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <p className="text-base leading-relaxed" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>{card.back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 animate-fade-up animation-delay-300">
        <button onClick={() => next(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--color-error-container)', color: 'var(--color-on-error-container)', border: '1px solid var(--color-error)/30' }}>
          <span className="material-symbols-outlined text-[18px]">close</span> Still Learning
        </button>
        <span className="text-xs font-medium" style={{ color: 'var(--color-outline)' }}>{idx + 1} / {totalCards}</span>
        <button onClick={() => next(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.3)' }}>
          Got it <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>

      {(pagination?.totalPages ?? 1) > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= (pagination?.totalPages ?? 1)}
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}