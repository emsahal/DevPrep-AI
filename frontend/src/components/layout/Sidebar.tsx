import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const SECTIONS = [
  {
    label: 'Learn',
    items: [
      { to: '/dashboard',      icon: 'dashboard',       label: 'Dashboard'  },
      { to: '/learning-paths', icon: 'map',              label: 'Roadmaps'   },
      { to: '/library',        icon: 'menu_book',        label: 'Library'    },
      { to: '/ai-tutor',       icon: 'smart_toy',        label: 'AI Tutor'   },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/quizzes',        icon: 'quiz',             label: 'Quizzes'    },
      { to: '/flashcards',     icon: 'style',            label: 'Flashcards' },
      { to: '/revision',       icon: 'event_repeat',     label: 'Revision'   },
      { to: '/interview-prep', icon: 'quiz',              label: 'Interview'   },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/code-analyzer',  icon: 'data_object',      label: 'Coding Practice'   },
      { to: '/resume-optimizer', icon: 'description',    label: 'Resume Optimizer' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/leaderboard',    icon: 'leaderboard',      label: 'Leaderboard'},
      { to: '/duel',           icon: 'sports_esports',   label: 'Duels',       tag: 'Soon' },
    ],
  },
  {
    items: [
      { to: '/bookmarks',      icon: 'bookmark',         label: 'Bookmarks'  },
    ],
  },
]

function SectionHeading({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider px-3 pt-4 pb-1"
       style={{ color: 'var(--color-outline)', fontFamily: 'var(--font-sans)' }}>
      {label}
    </p>
  )
}

export function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col pt-16 pb-4 z-40 hidden lg:flex"
           style={{ background: 'var(--color-surface-container-lowest)', borderRight: '1px solid var(--color-border-subtle)' }}>

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pt-2 space-y-0.5">
        {SECTIONS.map((section, si) => (
          <div key={si}>
            {section.label && <SectionHeading label={section.label} />}
            {section.items.map(({ to, icon, label, tag }) => {
              const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] leading-none ${active ? 'text-primary' : 'group-hover:text-primary transition-colors'}`}
                        style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                    {icon}
                  </span>
                  <span className="flex-1" style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
                  {tag && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                      {tag}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 mt-4">
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
