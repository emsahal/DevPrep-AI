import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMobileNavStore } from '@/store/mobileNavStore'
import { SECTIONS } from './Sidebar'

type SectionItem = { to: string; icon: string; label: string; tag?: string }

const ADMIN_EMAIL = 'sarcasticsahal@gmail.com'

function activePath(pathname: string, to: string): boolean {
  return pathname === to || (to !== '/' && pathname.startsWith(to))
}

export function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { isOpen, close } = useMobileNavStore()
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  const handleLogout = () => {
    close()
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 flex w-[85%] max-w-xs flex-col bg-[var(--color-surface-container-lowest)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ borderLeft: '1px solid var(--color-border-subtle)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-16 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
          >
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          {user && (
            <div className="flex-1 min-w-0 text-right pr-3">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>{user.name}</p>
              {user.email && <p className="text-xs truncate" style={{ color: 'var(--color-outline)' }}>{user.email}</p>}
            </div>
          )}
          <button
            onClick={close}
            aria-label="Close menu"
            className="material-symbols-outlined flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-white/5 text-outline"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            close
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-0.5">
          {SECTIONS.map((section, si) => (
            <div key={si}>
              {section.label && (
                <p
                  className="text-[10px] font-bold uppercase tracking-wider px-3 pt-4 pb-1"
                  style={{ color: 'var(--color-outline)', fontFamily: 'var(--font-sans)' }}
                >
                  {section.label}
                </p>
              )}
              {section.items.map((item: SectionItem) => {
                const active = activePath(location.pathname, item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] leading-none flex-shrink-0"
                      style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.tag && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                        style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}

          {isAdmin && (
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-wider px-3 pt-4 pb-1"
                style={{ color: 'var(--color-outline)', fontFamily: 'var(--font-sans)' }}
              >
                Admin
              </p>
              <Link
                to="/admin"
                onClick={close}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] leading-none flex-shrink-0">admin_panel_settings</span>
                <span className="flex-1 truncate" style={{ fontFamily: 'var(--font-sans)' }}>Post Studio</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-white/5 text-error"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span className="material-symbols-outlined text-[20px] leading-none">logout</span>
              <span>Sign out</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={close}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-bold transition-colors hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}