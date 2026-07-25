import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

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
  const { isAuthenticated, user, logout } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)

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
          <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            DevPrep<span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 rounded-xl px-3 py-2 gap-2 ai-glow-focus transition-all"
             style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-muted)' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
          <input
            type="text"
            placeholder="Search topics, roadmaps…"
            className="bg-transparent border-none outline-none w-full text-sm"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}
          />
          <kbd className="text-[10px] px-1 rounded border" style={{ color: 'var(--color-outline)', borderColor: 'var(--color-border-muted)', fontFamily: 'var(--font-mono)' }}>
            ⌘K
          </kbd>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle mobile */}
          <button
            className="md:hidden material-symbols-outlined text-[22px] transition-colors hover:text-primary"
            style={{ color: 'var(--color-on-surface-variant)' }}
            onClick={() => setSearchOpen(v => !v)}
          >
            search
          </button>

          {isAuthenticated ? (
            <>
              {/* Streak */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold"
                   style={{ background: 'var(--color-tertiary-container)/20', color: 'var(--color-tertiary)' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span>7</span>
              </div>
              {/* Notifications */}
              <button className="relative p-2 rounded-xl transition-colors hover:bg-surface-container-low"
                      style={{ color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
              </button>
              {/* Avatar */}
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer ring-2 ring-offset-2 transition-all hover:ring-primary"
                     style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)', ringOffsetColor: 'var(--color-bg-base)' }}>
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

      {/* Mobile search bar (collapsible) */}
      {searchOpen && (
        <div className="fixed top-16 left-0 w-full z-50 px-4 py-3 md:hidden"
             style={{ background: 'var(--color-surface-container-low)', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2"
               style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
            <input autoFocus type="text" placeholder="Search topics, roadmaps…"
                   className="bg-transparent border-none outline-none flex-1 text-sm"
                   style={{ color: 'var(--color-on-surface)' }} />
          </div>
        </div>
      )}

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
