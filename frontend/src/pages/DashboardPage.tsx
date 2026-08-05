import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { dashboardService } from '@/services/dashboardService'
import { useAuthStore } from '@/store/authStore'

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return { greeting: 'Good Morning', note: 'Rise and shine — let\u2019s get some learning in!' }
  if (hour >= 12 && hour < 17) return { greeting: 'Good Afternoon', note: 'Halfway there — keep up the momentum!' }
  if (hour >= 17 && hour < 21) return { greeting: 'Good Evening', note: 'Perfect time for a quick review session.' }
  return { greeting: 'Good Night', note: 'Night owl detected \uD83E\uDD83 — brilliant focus hours ahead!' }
}

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  })

  const { data: activity } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => dashboardService.getRecentActivity(),
  })

  const { data: progress } = useQuery({
    queryKey: ['dashboard', 'progress'],
    queryFn: () => dashboardService.getLearningProgress(),
  })

  const isLoading = statsLoading



  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-7xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  const doneCount = stats?.completedTopics ?? 0
  const totalCount = stats?.totalTopics ?? 1
  const pct = stats?.completionRate ?? 0
  const streakDays = stats?.streakDays ?? 0

  const user = useAuthStore((s) => s.user)
  const firstName = user?.name?.split(' ')[0] || 'there'
  const { greeting, note } = getGreeting(new Date().getHours())

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">

      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
          {note}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">

        <section className="col-span-12 lg:col-span-3 bento-card p-5 flex flex-col gap-4 animate-fade-up animation-delay-100">
          <div className="flex items-center justify-between">
            <span className="pill" style={{ background: 'var(--color-primary)/10', color: 'var(--color-primary)' }}>PROGRESS</span>
            <span className="text-xs font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
          </div>

          <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path fill="none" strokeWidth="3" style={{ stroke: 'var(--color-surface-container-high)' }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path fill="none" strokeWidth="3" strokeLinecap="round"
                    style={{ stroke: 'var(--color-primary)' }}
                    strokeDasharray={`${pct}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{doneCount}/{totalCount}</span>
              <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--color-outline)' }}>Topics</span>
            </div>
          </div>

          <ul className="space-y-2">
            {[
              { done: true, label: `${doneCount} Topics Completed` },
              { done: true, label: `${stats?.quizAttempts ?? 0} Quizzes Taken` },
              { done: false, label: `${streakDays}-Day Streak`, active: true },
            ].map(t => (
              <li key={t.label} className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[18px] leading-none"
                      style={{ color: t.done ? 'var(--color-success)' : t.active ? 'var(--color-primary)' : 'var(--color-border-muted)', fontVariationSettings: t.done ? "'FILL' 1" : "'FILL' 0" }}>
                  {t.done ? 'check_circle' : t.active ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span style={{ color: t.done ? 'var(--color-on-surface-variant)' : t.active ? 'var(--color-on-surface)' : 'var(--color-outline)' }}
                      className={t.done ? 'line-through' : ''}>
                  {t.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12 lg:col-span-6 bento-card relative overflow-hidden animate-fade-up animation-delay-100"
                 style={{ minHeight: '260px' }}>
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
               style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />

          <div className="relative z-10 h-full flex flex-col justify-end p-8">
            <span className="pill mb-3 self-start" style={{ background: 'rgba(208,188,255,0.15)', color: 'var(--color-primary)', border: '1px solid rgba(208,188,255,0.3)' }}>
              CURRENT MODULE
            </span>
            <h2 className="text-3xl font-extrabold leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>
              JavaScript Closures<br />&amp; The Event Loop
            </h2>
            <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
              Deep dive into lexical scoping, closures, and the JavaScript runtime model.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/topics/functions-scope"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                Continue
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </Link>
              <span className="text-sm" style={{ color: 'var(--color-outline)' }}>
                <span className="material-symbols-outlined text-[16px] align-middle mr-1">schedule</span>
                ~45 min left
              </span>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-3 bento-card p-5 flex flex-col animate-fade-up animation-delay-200">
          <div className="flex items-center justify-between mb-5">
            <span className="pill" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>PROGRESS</span>
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-primary)' }}>Full Stack</span>
          </div>
          <div className="relative pl-5 flex-1 space-y-6"
               style={{ borderLeft: '2px solid var(--color-border-muted)', marginLeft: '7px' }}>
            {(progress ?? []).slice(0, 4).map((s, i) => (
              <div key={s.id || i} className="relative">
                <div className="absolute -left-[22px] top-0.5 w-4 h-4 rounded-full ring-4 flex items-center justify-center"
                     style={{
                       background: s.progress >= 100 ? 'var(--color-success)' : i === 0 ? 'var(--color-primary)' : 'var(--color-surface-container)',

                       border: s.progress < 100 && i > 0 ? '1px solid var(--color-border-muted)' : 'none',
                     }}>
                  {s.progress >= 100 && <span className="material-symbols-outlined text-[10px] font-bold" style={{ color: '#000', fontVariationSettings: "'FILL' 1" }}>check</span>}
                  {i === 0 && s.progress < 100 && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </div>
                <p className="text-sm font-semibold" style={{ color: s.progress >= 100 ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)' }}>{s.name}</p>
                <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                   style={{ color: s.progress >= 100 ? 'var(--color-success)' : i === 0 ? 'var(--color-primary)' : 'var(--color-border-muted)' }}>
                  {s.progress >= 100 ? 'Completed' : i === 0 ? `${s.progress}%` : 'Pending'}
                </p>
              </div>
            ))}
          </div>
          <Link to="/learning-paths" className="mt-5 text-xs font-medium flex items-center gap-1 transition-colors hover:text-primary"
                style={{ color: 'var(--color-outline)' }}>
            View full roadmap <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </section>

        <section className="col-span-12 lg:col-span-8 bento-card p-5 animate-fade-up animation-delay-200">
          <div className="flex items-center justify-between mb-5">
            <span className="pill" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>RECENT ACTIVITY</span>
            <span className="text-xs" style={{ color: 'var(--color-outline)' }}>Latest</span>
          </div>
          <div className="space-y-3">
            {(activity ?? []).slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined text-xl flex-shrink-0"
                      style={{ color: a.type === 'quiz' ? 'var(--color-warning)' : a.type === 'topic' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                  {a.type === 'quiz' ? 'quiz' : a.type === 'topic' ? 'article' : 'event_repeat'}
                </span>
                <p className="flex-1 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{a.action}</p>
                {a.score != null && (
                  <span className="text-xs font-bold" style={{ color: a.score >= 70 ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {a.score}%
                  </span>
                )}
              </div>
            ))}
            {(!activity || activity.length === 0) && (
              <p className="text-sm text-center py-6" style={{ color: 'var(--color-outline)' }}>No activity yet. Start learning!</p>
            )}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 bento-card p-5 animate-fade-up animation-delay-300">
          <span className="pill mb-4 block" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>QUICK ACTIONS</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'quiz',         label: 'Quick Quiz',     to: '/quizzes'        },
              { icon: 'style',        label: 'Flashcards',     to: '/flashcards'     },
              { icon: 'smart_toy',    label: 'AI Tutor',       to: '/ai-tutor'       },
              { icon: 'data_object',  label: 'Code Lab',       to: '/code-analyzer'  },
            ].map(a => (
              <Link key={a.label} to={a.to}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:bg-surface-container active:scale-95 text-center"
                    style={{ border: '1px solid var(--color-border-muted)' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>
                  {a.icon}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}