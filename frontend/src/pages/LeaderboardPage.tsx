import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gamificationService } from '@/services/gamificationService'
import type { LeaderboardEntry } from '@/types'

const TABS = [
  { key: 'global', label: 'Global' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'topic', label: 'By Topic' },
  { key: 'friends', label: 'Friends' },
] as const

type TabKey = (typeof TABS)[number]['key']

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return <span className="text-sm font-bold w-6 text-center" style={{ color: 'var(--color-outline)' }}>{rank}</span>
}

function LeaderboardTable({ entries, currentUserId }: { entries: LeaderboardEntry[]; currentUserId?: string }) {
  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const isMe = entry.userId === currentUserId
        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isMe ? 'ring-1' : ''
            }`}
            style={{
              background: isMe ? 'var(--color-primary)/8' : 'var(--color-surface-container-lowest)',
              borderColor: isMe ? 'var(--color-primary)' : 'transparent',
            }}
          >
            <RankIcon rank={entries.indexOf(entry) + 1} />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                 style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              {entry.name?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>
                {entry.name}
                {isMe && <span className="text-[10px] ml-1" style={{ color: 'var(--color-primary)' }}>(you)</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>
                {entry.points.toLocaleString()}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--color-outline)' }}>
                Lvl {entry.level}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('global')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', activeTab, page],
    queryFn: () => gamificationService.getLeaderboard(
      activeTab === 'friends' ? 'global' : activeTab as 'global' | 'weekly',
      page,
    ),
    staleTime: 30_000,
  })

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>
          Leaderboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          See how you stack up against the community
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl animate-fade-up animation-delay-100"
           style={{ background: 'var(--color-surface-container-low)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1) }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: activeTab === tab.key ? 'var(--color-surface-container)' : 'transparent',
              color: activeTab === tab.key ? 'var(--color-on-surface)' : 'var(--color-outline)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Friends placeholder */}
      {activeTab === 'friends' && (
        <div className="bento-card p-12 text-center animate-fade-up">
          <span className="material-symbols-outlined text-5xl mb-3" style={{ color: 'var(--color-outline)' }}>people</span>
          <p className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>Friends Leaderboard</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            Coming soon — follow your friends to see their rankings here.
          </p>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab !== 'friends' && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-3xl" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
            </div>
          ) : data && data.entries.length > 0 ? (
            <>
              <LeaderboardTable entries={data.entries} />

              {/* Current user rank */}
              {data.currentUser && (
                <div className="mt-4 p-4 rounded-xl text-center animate-fade-up"
                     style={{ background: 'var(--color-surface-container-low)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    You're <strong className="text-lg" style={{ color: 'var(--color-primary)' }}>#{data.currentUser.rank}</strong>
                    {' '}with {data.currentUser.points.toLocaleString()} points
                  </p>
                </div>
              )}

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30"
                    style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm" style={{ color: 'var(--color-outline)' }}>
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <button
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30"
                    style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bento-card p-12 text-center">
              <span className="material-symbols-outlined text-5xl mb-3" style={{ color: 'var(--color-outline)' }}>leaderboard</span>
              <p className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>No data yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Complete quizzes and flashcards to earn points and climb the ranks.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
