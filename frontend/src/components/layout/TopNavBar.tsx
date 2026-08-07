import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { gamificationService } from '@/services/gamificationService'
import { NotificationDropdown } from '@/features/notifications/NotificationDropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMobileNavStore } from '@/store/mobileNavStore'
import logo from '@/assets/logo.png'

export function TopNavBar() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const isHome = location.pathname === '/'
  const { toggle: toggleMobileNav } = useMobileNavStore()

  const { data: gamificationStats } = useQuery({
    queryKey: ['gamification', 'stats'],
    queryFn: () => gamificationService.getStats(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  })

  const navLinks = [
    { to: '/learning-paths', label: 'Roadmaps' },
    { to: '/code-analyzer',  label: 'Code Lab' },
    { to: '/interview-prep', label: 'Practice' },
    { to: '/library',        label: 'Library' },
    { to: '/blogs',          label: 'Blogs' },
    { to: '/ai-tutor',       label: 'AI Tutor' },
  ]

  return (
    <>
      {/* Top bar overlay above background */}
      <header
        className="fixed left-0 w-full z-50 transition-all duration-300"
        style={{
          top: 'var(--quote-banner, 0px)',
          overflowX: 'clip',
          background: isHome ? 'rgba(0, 0, 0, 0.2)' : 'rgba(13, 13, 13, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: isHome ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid var(--color-border-subtle)',
        }}
      >
        <div className="h-16 px-3 sm:px-5 md:px-10 flex items-center justify-between relative">
          {/* Hamburger (mobile) */}
          <button
            onClick={toggleMobileNav}
            aria-label="Open menu"
            className="lg:hidden mr-1 flex-shrink-0 p-2 -ml-1 rounded-lg transition-colors hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ color: 'var(--color-on-surface)' }}>menu</span>
          </button>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="DevPrep logo" className="h-8 w-8 object-contain" />
            <span className="text-lg tracking-tight" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'var(--color-on-surface)' }}>
              DevPrep
            </span>
          </Link>

          {/* Centered Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ to, label }) => {
              const target = isAuthenticated ? to : '/login'
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={target}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  style={{
                    color: active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.85)',
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
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
                  <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-offset-1 transition-all hover:ring-primary">
                    <AvatarImage src={user?.avatar ?? undefined} />
                    <AvatarFallback style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)', fontSize: '0.875rem', fontWeight: 700 }}>
                      {user?.name?.charAt(0) ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Link to="/register"
                    className="px-4 py-1.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                Join
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
