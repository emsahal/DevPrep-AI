import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavBar } from './TopNavBar'

export function AppLayout() {
  return (
    <div style={{ background: 'var(--color-bg-base)', color: 'var(--color-on-surface)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <TopNavBar />
      <Sidebar />
      {/* Main: offset for sidebar (lg) and top nav; add bottom padding for mobile tab bar */}
      <main className="lg:ml-60 pt-16 pb-20 lg:pb-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
