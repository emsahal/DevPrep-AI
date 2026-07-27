import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { gamificationService } from '@/services/gamificationService'
import { NotificationDropdown } from '@/features/notifications/NotificationDropdown'
import logo from '@/assets/logo.png'
const MOBILE_TABS = [
  { to: '/dashboard',      icon: 'dashboard',   label: 'Home'      },
  { to: '/learning-paths', icon: 'map',         label: 'Roadmaps'  },
  { to: '/library',        icon: 'menu_book',   label: 'Library'   },
  { to: '/interview-prep', icon: 'quiz',        label: 'Prep'      },
  { to: '/ai-tutor',       icon: 'smart_toy',   label: 'AI Tutor'  },
  { to: '/profile',        icon: 'person',      label: 'Profile'   },
]

export function TopNavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [query, setQuery] = useState('')

  const { data: gamificationStats } = useQuery({
    queryKey: ['gamification', 'stats'],
    queryFn: () => gamificationService.getStats(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  })

  return (
    <>
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-6"
        style={{
          background: 'rgba(13,13,13,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="DevPrep AI logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            DevPrep<span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex items-center flex-1 max-w-sm mx-8 rounded-xl px-3 py-2 gap-2 ai-glow-focus transition-all"
             style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-muted)' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                navigate(`/library?q=${encodeURIComponent(query.trim())}`)
              }
            }}
            placeholder="Search topics, roadmaps…"
            className="bg-transparent border-none outline-none w-full text-sm"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}
          />
          <kbd className="hidden sm:inline text-[10px] px-1 rounded border" style={{ color: 'var(--color-outline)', borderColor: 'var(--color-border-muted)', fontFamily: 'var(--font-mono)' }}>
            ⌘K
          </kbd>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Dashboard */}
              <Link to="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 mr-1.5"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Streak */}
              <Link to="/leaderboard" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-80"
                   style={{ background: 'var(--color-tertiary-container)/20', color: 'var(--color-tertiary)' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span>{gamificationStats?.currentStreak ?? 0}</span>
              </Link>
              {/* Level badge */}
              {gamificationStats && (
                <Link to="/leaderboard" className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:opacity-80"
                     style={{ background: 'var(--color-primary)/15', color: 'var(--color-primary)' }}>
                  Lvl {gamificationStats.level}
                </Link>
              )}
              <NotificationDropdown />
              {/* Avatar */}
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer ring-2 ring-offset-2 transition-all hover:ring-primary"
                     style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                    className="px-4 py-1.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-container-low"
                    style={{ color: 'var(--color-on-surface-variant)' }}>
                Log in
              </Link>
              <Link to="/register"
                    className="px-4 py-1.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex lg:hidden"
           style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--color-border-subtle)' }}>
        {MOBILE_TABS.map(({ to, icon, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
          return (
            <Link key={to} to={to} className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors"
                  style={{ color: active ? 'var(--color-primary)' : 'var(--color-outline)' }}>
              <span className="material-symbols-outlined text-[22px] leading-none"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span className="text-[10px] font-medium" style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
            </Link>
          )
        })}
      </nav>

    </>
  )
}
