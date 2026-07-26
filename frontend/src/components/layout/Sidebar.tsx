import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'


const NAV_ITEMS = [
  { to: '/dashboard',      icon: 'dashboard',       label: 'Dashboard'  },
  { to: '/learning-paths', icon: 'map',              label: 'Roadmaps'   },
  { to: '/library',        icon: 'menu_book',        label: 'Library'    },
  { to: '/ai-tutor',       icon: 'smart_toy',        label: 'AI Tutor'   },
  { to: '/code-analyzer',  icon: 'data_object',      label: 'Analyzer'   },
  { to: '/quizzes',        icon: 'quiz',             label: 'Quizzes'    },
  { to: '/flashcards',     icon: 'style',            label: 'Flashcards' },
  { to: '/revision',       icon: 'event_repeat',     label: 'Revision'   },
  { to: '/interview-prep', icon: 'quiz',              label: 'Interview'   },
  { to: '/leaderboard',    icon: 'leaderboard',      label: 'Leaderboard'},
  { to: '/bookmarks',      icon: 'bookmark',         label: 'Bookmarks'  },
]

export function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col pt-16 pb-4 z-40 hidden lg:flex"
           style={{ background: 'var(--color-surface-container-lowest)', borderRight: '1px solid var(--color-border-subtle)' }}>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pt-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] leading-none ${active ? 'text-primary' : 'group-hover:text-primary transition-colors'}`}
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom: User + Upgrade */}
      <div className="px-3 space-y-3 mt-4">
        {/* Upgrade card */}
        <div className="relative overflow-hidden rounded-xl p-4 border border-primary/20"
             style={{ background: 'linear-gradient(135deg, rgba(208,188,255,0.08) 0%, rgba(76,215,246,0.05) 100%)' }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20"
               style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
          <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>Pro Account</p>
          <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>Unlock AI-powered code reviews & unlimited quizzes.</p>
          <button className="w-full py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            Upgrade Now
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl"
               style={{ borderTop: '1px solid var(--color-border-muted)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                 style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              {user.name?.charAt(0) ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-outline)' }}>{user.email}</p>
            </div>
            <button onClick={logout} title="Sign out"
                    className="material-symbols-outlined text-[18px] transition-colors hover:text-error"
                    style={{ color: 'var(--color-outline)', fontVariationSettings: "'FILL' 0" }}>
              logout
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
