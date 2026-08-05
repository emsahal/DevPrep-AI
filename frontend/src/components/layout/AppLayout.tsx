import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavBar } from './TopNavBar'
import { Footer } from './Footer'
import { ReviewModal } from '../common/ReviewModal'

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  useEffect(() => {
    // Listen for manual triggers from "Write a Review" buttons
    const handleOpen = () => setIsReviewOpen(true)
    window.addEventListener('open-review-modal', handleOpen)

    // Trigger feedback popup after navigating 3 pages on the platform (if not already reviewed)
    const reviewed = localStorage.getItem('devprep_reviewed') === 'true'
    if (!reviewed && !isHome) {
      const hits = Number(sessionStorage.getItem('devprep_page_hits') || '0') + 1
      sessionStorage.setItem('devprep_page_hits', hits.toString())
      
      if (hits === 3) {
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
      <main className={`${isHome ? '' : 'lg:ml-60 pt-16'} pb-20 lg:pb-0 min-h-screen`}>
        <Outlet />
      </main>
      {isHome && <Footer />}

      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
      />
    </div>
  )
}
