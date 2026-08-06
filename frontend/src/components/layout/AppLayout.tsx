import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Sidebar } from './Sidebar'
import { TopNavBar } from './TopNavBar'
import { MobileNav } from './MobileNav'
import { QuoteBanner } from './QuoteBanner'
import { Footer } from './Footer'
import { ReviewModal } from '../common/ReviewModal'
import { useSidebarStore } from '@/store/sidebarStore'
import { useMobileNavStore } from '@/store/mobileNavStore'
import { useAuthStore } from '@/store/authStore'
import { dashboardService } from '@/services/dashboardService'

const REVIEW_TOPIC_THRESHOLD = 10

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const hasShownRef = useRef(false)
  const { isOpen } = useSidebarStore()
  const { close: closeMobileNav } = useMobileNavStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const queryClient = useQueryClient()

  const [quoteDismissed, setQuoteDismissed] = useState(false)
  useEffect(() => {
    const d = new Date()
    const todayKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    if (localStorage.getItem('devprep_quote_dismissed') === todayKey) setQuoteDismissed(true)
  }, [])
  const dismissQuote = () => {
    const d = new Date()
    setQuoteDismissed(true)
    localStorage.setItem('devprep_quote_dismissed', `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)
  }

  const { data: stats } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  })

  const completedTopics = stats?.completedTopics ?? 0

  // Refresh completion count whenever the route changes
  useEffect(() => {
    closeMobileNav()
    if (isAuthenticated && !isHome) {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
    }
  }, [location.pathname, isAuthenticated, isHome, queryClient, closeMobileNav])

  useEffect(() => {
    // Listen for manual triggers from "Write a Review" buttons
    const handleOpen = () => setIsReviewOpen(true)
    window.addEventListener('open-review-modal', handleOpen)

    // Trigger feedback popup once the user has completed 10 topics (if not already reviewed)
    const reviewed = localStorage.getItem('devprep_reviewed') === 'true'
    if (!reviewed && !isHome && isAuthenticated && completedTopics >= REVIEW_TOPIC_THRESHOLD && !hasShownRef.current) {
      hasShownRef.current = true
      setIsReviewOpen(true)
    }

    return () => {
      window.removeEventListener('open-review-modal', handleOpen)
    }
  }, [location.pathname, isHome, isAuthenticated, completedTopics])

  return (
    <div
      style={{
        background: 'var(--color-bg-base)',
        color: 'var(--color-on-surface)',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans)',
        ['--quote-banner' as string]: quoteDismissed ? '0px' : '40px',
      }}
    >
      <QuoteBanner visible={!quoteDismissed} onClose={dismissQuote} />
      <TopNavBar />
      <MobileNav />
      {!isHome && <Sidebar />}
      <main
        className="min-h-screen transition-all duration-300"
        style={{
          paddingTop: isHome ? 0 : 'calc(4rem + var(--quote-banner, 0px))',
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
