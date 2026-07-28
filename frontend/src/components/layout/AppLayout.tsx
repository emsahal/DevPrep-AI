import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavBar } from './TopNavBar'
import { Footer } from './Footer'

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div style={{ background: 'var(--color-bg-base)', color: 'var(--color-on-surface)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <TopNavBar />
      {!isHome && <Sidebar />}
      <main className={`${isHome ? '' : 'lg:ml-60'} pt-16 pb-20 lg:pb-0 min-h-screen`}>
        <Outlet />
      </main>
      {isHome && <Footer />}
    </div>
  )
}
