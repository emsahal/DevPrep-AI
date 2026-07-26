import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDuelStore } from '@/store/duelStore'

export function DuelResultsPage() {
  const navigate = useNavigate()
  const { duelResult, reset } = useDuelStore()

  useEffect(() => {
    if (!duelResult) {
      navigate('/duel', { replace: true })
    }
  }, [duelResult, navigate])

  if (!duelResult) return null

  const isWin = duelResult.winnerId === 'me' // client sets winnerId to 'me' or opponent id
  const isDraw = !duelResult.winnerId

  return (
    <div className="px-6 py-12 max-w-lg mx-auto animate-fade-up text-center">
      {/* Result icon */}
      <div className="mb-6">
        <span className="material-symbols-outlined text-8xl"
              style={{ color: isWin ? '#16a34a' : isDraw ? 'var(--color-on-surface-variant)' : '#dc2626' }}>
          {isWin ? 'emoji_events' : isDraw ? 'handshake' : 'sentiment_dissatisfied'}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-on-surface)' }}>
        {isWin ? 'Victory!' : isDraw ? 'Draw!' : 'Defeat'}
      </h1>

      {/* Score */}
      <div className="flex justify-center gap-8 my-8">
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>You</p>
          <p className="text-5xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{duelResult.score1}</p>
        </div>
        <div className="text-3xl font-bold self-end mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>:</div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Opponent</p>
          <p className="text-5xl font-extrabold" style={{ color: 'var(--color-error)' }}>{duelResult.score2}</p>
        </div>
      </div>

      {/* Breakdown */}
      {duelResult.breakdown && (
        <div className="bento-card p-5 mb-6 text-left">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-outline)' }}>Your Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Accuracy</span>
              <span className="font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>{duelResult.breakdown.player1.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Speed</span>
              <span className="font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>{duelResult.breakdown.player1.speed}s avg</span>
            </div>
          </div>
        </div>
      )}

      {/* XP earned */}
      <div className="bento-card p-5 mb-8 flex items-center justify-center gap-3"
           style={{ borderColor: 'var(--color-tertiary)' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)' }}>bolt</span>
        <p className="font-bold text-lg" style={{ color: 'var(--color-tertiary)' }}>
          +{duelResult.xpEarned} XP
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={() => { reset(); navigate('/duel') }}
                className="px-6 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
          Play Again
        </button>
        <button onClick={() => { reset(); navigate('/') }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
          Home
        </button>
      </div>
    </div>
  )
}
