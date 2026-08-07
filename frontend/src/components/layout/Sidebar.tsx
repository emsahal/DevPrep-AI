import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSidebarStore } from '@/store/sidebarStore'


const SECTIONS = [
  {
    label: 'Learn',
    items: [
      { to: '/dashboard',      icon: 'dashboard',       label: 'Dashboard'  },
      { to: '/learning-paths', icon: 'map',              label: 'Roadmaps'   },
      { to: '/library',        icon: 'menu_book',        label: 'Library'    },
      { to: '/blogs',          icon: 'article',          label: 'Blogs'      },
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
      { to: '/code-analyzer',    icon: 'data_object',   label: 'Coding Practice'   },
      { to: '/resume-optimizer', icon: 'description',   label: 'Resume Optimizer' },
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
      { to: '/profile',        icon: 'person',           label: 'Profile'    },
    ],
  },
]

export { SECTIONS }

const ADMIN_EMAIL = 'sarcasticsahal@gmail.com'

function SectionHeading({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="h-4" />
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
  const { isOpen, toggle } = useSidebarStore()
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen flex-col pb-4 z-40 hidden lg:flex transition-all duration-300 ease-in-out"
        style={{
          width: isOpen ? '240px' : '64px',
          paddingTop: 'calc(4rem + var(--quote-banner, 0px))',
          background: 'var(--color-surface-container-lowest)',
          borderRight: '1px solid var(--color-border-subtle)',
          overflow: 'visible',
        }}
      >
        {/* Floating toggle button — pinned to right edge at vertical center */}
        <button
          onClick={toggle}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
          style={{
            background: 'var(--color-surface-container-highest, #2a2a35)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-outline)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>
            chevron_left
          </span>
        </button>

        {/* Inner wrapper clips the nav content */}
        <div className="flex flex-col flex-1 overflow-hidden">
        <nav className="flex-1 overflow-y-auto no-scrollbar px-2 pt-2 space-y-0.5">
          {SECTIONS.map((section, si) => (
            <div key={si}>
              {section.label && <SectionHeading label={section.label} collapsed={!isOpen} />}
              {section.items.map(({ to, icon, label, tag }: { to: string; icon: string; label: string; tag?: string }) => {
                const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                return (
                  <Link
                    key={to}
                    to={to}
                    title={!isOpen ? label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-white/5'
                    }`}
                    style={{ minWidth: 0 }}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] leading-none flex-shrink-0 ${active ? 'text-primary' : ''}`}
                      style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {icon}
                    </span>
                    <span
                      className="flex-1 whitespace-nowrap overflow-hidden transition-all duration-300"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        maxWidth: isOpen ? '160px' : '0px',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {label}
                    </span>
                    {tag && isOpen && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                        style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                      >
                        {tag}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
          {isAdmin && (
            <div>
              <SectionHeading label="Admin" collapsed={!isOpen} />
              <Link
                to="/admin"
                title={!isOpen ? 'Post Studio' : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] leading-none flex-shrink-0 ${location.pathname === '/admin' ? 'text-primary' : ''}`}
                  style={{ fontVariationSettings: location.pathname === '/admin' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  admin_panel_settings
                </span>
                <span
                  className="flex-1 whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    maxWidth: isOpen ? '160px' : '0px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Post Studio
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* User */}
        <div className="px-2 mt-4">
          {user && (
            <div
              className="flex items-center gap-3 px-2 py-2 rounded-xl overflow-hidden"
              style={{ borderTop: '1px solid var(--color-border-muted)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
              >
                {user.name?.charAt(0) ?? 'U'}
              </div>
              <div
                className="flex-1 min-w-0 overflow-hidden transition-all duration-300"
                style={{ opacity: isOpen ? 1 : 0, maxWidth: isOpen ? '120px' : '0px' }}
              >
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-outline)' }}>{user.email}</p>
              </div>
              {isOpen && (
                <button
                  onClick={logout}
                  title="Sign out"
                  className="material-symbols-outlined text-[18px] transition-colors hover:text-error flex-shrink-0"
                  style={{ color: 'var(--color-outline)', fontVariationSettings: "'FILL' 0" }}
                >
                  logout
                </button>
              )}
            </div>
          )}
        </div>
        </div>{/* end inner wrapper */}
      </aside>
    </>
  )
}
