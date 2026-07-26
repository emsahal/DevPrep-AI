import { useQuery } from '@tanstack/react-query'
import { gamificationService } from '@/services/gamificationService'
import type { UserBadge } from '@/types'

interface BadgesGridProps {
  earnedBadges: UserBadge[]
}

export function BadgesGrid({ earnedBadges }: BadgesGridProps) {
  const { data: allBadges } = useQuery({
    queryKey: ['badges', 'all'],
    queryFn: () => gamificationService.getBadges(),
  })

  const earnedKeys = new Set(earnedBadges.map(b => b.key))

  if (!allBadges) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {allBadges.map(badge => {
        const earned = earnedKeys.has(badge.key)
        const userBadge = earnedBadges.find(b => b.key === badge.key)
        return (
          <div
            key={badge.key}
            className={`bento-card p-4 flex flex-col items-center gap-2 text-center transition-all ${
              earned ? '' : 'opacity-40 grayscale'
            }`}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{
                background: earned ? 'var(--color-primary)' : 'var(--color-surface-container)',
                color: earned ? 'var(--color-on-primary-fixed)' : 'var(--color-outline)',
              }}
            >
              {badge.key.startsWith('streak') ? '🔥' :
               badge.key.startsWith('flashcard') ? '💳' :
               badge.key.startsWith('quiz') ? '📝' :
               badge.key.startsWith('roadmap') ? '🗺️' :
               badge.key.startsWith('top10') ? '🏆' :
               badge.key.startsWith('level') ? '⭐' :
               badge.key.startsWith('points') ? '💎' : '🏅'}
            </div>
            <p className="text-sm font-bold leading-tight" style={{ color: 'var(--color-on-surface)' }}>
              {badge.name}
            </p>
            <p className="text-[10px] leading-tight" style={{ color: 'var(--color-outline)' }}>
              {badge.description}
            </p>
            {userBadge && (
              <p className="text-[9px] mt-1" style={{ color: 'var(--color-tertiary)' }}>
                Earned {new Date(userBadge.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
