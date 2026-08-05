import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavBar } from './TopNavBar'
import { Footer } from './Footer'
import { ReviewModal } from '../common/ReviewModal'
import { useSidebarStore } from '@/store/sidebarStore'

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const { isOpen } = useSidebarStore()

  useEffect(() => {
    // Listen for manual triggers from "Write a Review" buttons
    const handleOpen = () => setIsReviewOpen(true)
    window.addEventListener('open-review-modal', handleOpen)

    // Trigger feedback popup immediately when user uses the platform (if not already reviewed)
    const reviewed = localStorage.getItem('devprep_reviewed') === 'true'
    if (!reviewed && !isHome) {
      const hits = Number(sessionStorage.getItem('devprep_page_hits') || '0') + 1
      sessionStorage.setItem('devprep_page_hits', hits.toString())
      
      if (hits >= 1) {
        setIsReviewOpen(true)
      }
    }

    return () => {
      window.removeEventListener('open-review-modal', handleOpen)
    }
  }, [location.pathname, isHome])

  return (
    <div style={{ background: 'var(--color-bg-base)', color: 'var(--color-on-surface)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <TopNavBar />
      {!isHome && <Sidebar />}
      <main
        className="pb-20 lg:pb-0 min-h-screen transition-all duration-300"
        style={{
          paddingTop: isHome ? 0 : '4rem',
          paddingLeft: isHome ? 0 : undefined,
          marginLeft: !isHome ? undefined : 0,
        }}
      >
        {/* On desktop, shift content by sidebar width */}
        <div
          className="transition-all duration-300 h-full"
          style={{ marginLeft: !isHome ? (isOpen ? '240px' : '64px') : 0 }}
        >
          <Outlet />
        </div>
      </main>
      {isHome && <Footer />}

      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
      />
    </div>
  )
}
