import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { profileService } from '@/services/profileService'
import { dashboardService } from '@/services/dashboardService'
import { gamificationService } from '@/services/gamificationService'
import { BadgesGrid } from '@/features/gamification/components/BadgesGrid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ProfilePage() {
  const { user: storeUser } = useAuthStore()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  })

  const { data: stats } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  })

  const { data: gamificationStats } = useQuery({
    queryKey: ['gamification', 'stats'],
    queryFn: () => gamificationService.getStats(),
  })

  const user = profile ?? storeUser

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="bento-card ai-glow-border p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-fade-up">
        <Avatar className="w-20 h-20 flex-shrink-0 ring-2 ring-offset-2">
          <AvatarImage src={user?.avatar ?? undefined} />
          <AvatarFallback className="text-3xl font-extrabold"
                         style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            {user?.name?.charAt(0) ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>
            {user?.name ?? 'Developer'}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--color-outline)' }}>{user?.email ?? 'user@devprep.ai'}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="pill" style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(208,188,255,0.25)' }}>Full Stack Track</span>
            <span className="pill" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.25)' }}>{stats?.streakDays ?? 0}-Day Streak 🔥</span>
            {gamificationStats && (
              <span className="pill" style={{ background: 'rgba(208,188,255,0.15)', color: 'var(--color-tertiary)', border: '1px solid rgba(208,188,255,0.25)' }}>
                Lvl {gamificationStats.level} · {gamificationStats.title}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* XP Bar */}
      {gamificationStats && (
        <div className="bento-card p-5 mb-6 animate-fade-up animation-delay-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>
              Level {gamificationStats.level} — {gamificationStats.title}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
              {gamificationStats.xp.toLocaleString()} / {gamificationStats.nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, ((gamificationStats.xp - gamificationStats.currentLevelXp) / (gamificationStats.nextLevelXp - gamificationStats.currentLevelXp)) * 100)}%`,
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-tertiary))',
              }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs" style={{ color: 'var(--color-outline)' }}>
            <span>🔥 {gamificationStats.currentStreak}-day streak</span>
            <span>🏆 {gamificationStats.totalPoints.toLocaleString()} total points</span>
          </div>
        </div>
      )}

      {/* Badges */}
      {gamificationStats && gamificationStats.badges.length > 0 && (
        <div className="mb-8 animate-fade-up animation-delay-75">
          <h2 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: 'var(--color-outline)' }}>
            Badges & Achievements
          </h2>
          <BadgesGrid earnedBadges={gamificationStats.badges} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up animation-delay-100">
        {[
          { label: 'Topics Mastered', value: String(stats?.completedTopics ?? 0),  icon: 'school'            },
          { label: 'Quizzes Taken',   value: String(stats?.quizAttempts ?? 0),     icon: 'quiz'              },
          { label: 'Level',           value: gamificationStats ? `Lvl ${gamificationStats.level}` : '—', icon: 'stars' },
          { label: 'Total Points',    value: gamificationStats ? gamificationStats.totalPoints.toLocaleString() : '0', icon: 'trophy' },
        ].map(s => (
          <div key={s.label} className="bento-card p-5 flex flex-col items-center gap-2 text-center">
            <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>{s.icon}</span>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--color-on-surface)' }}>{s.value}</span>
            <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bento-card p-6 animate-fade-up animation-delay-200">
        <h2 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: 'var(--color-outline)' }}>Account Info</h2>
        <div className="space-y-3">
          {[
            { icon: 'person', label: 'Name', value: user?.name ?? '—' },
            { icon: 'email', label: 'Email', value: user?.email ?? '—' },
            { icon: 'calendar_today', label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
          ].map(a => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
              <span className="material-symbols-outlined text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }}>{a.icon}</span>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                <span className="font-semibold">{a.label}:</span> {a.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}