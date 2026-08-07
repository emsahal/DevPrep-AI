import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { AuthCallbackPage } from '@/features/auth/AuthCallbackPage'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LearningPathsPage } from '@/pages/LearningPathsPage'
import { LearningPathDetailPage } from '@/pages/LearningPathDetailPage'
import { TechnologyLibraryPage } from '@/pages/TechnologyLibraryPage'
import { TechnologyDetailPage } from '@/pages/TechnologyDetailPage'
import { TopicPage } from '@/pages/TopicPage'
import { AITutorPage } from '@/pages/AITutorPage'
import { CodeAnalyzerPage } from '@/pages/CodeAnalyzerPage'
import { QuizzesPage } from '@/pages/QuizzesPage'
import { QuizDetailPage } from '@/pages/QuizDetailPage'
import { FlashcardsPage } from '@/pages/FlashcardsPage'
import { RevisionPage } from '@/pages/RevisionPage'
import { SearchPage } from '@/pages/SearchPage'
import { BookmarksPage } from '@/pages/BookmarksPage'
import { InterviewPrepPage } from '@/pages/InterviewPrepPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { DuelPage } from '@/pages/DuelPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { InterviewPrepTopicPage } from '@/pages/InterviewPrepTopicPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ResumeOptimizerPage } from '@/pages/ResumeOptimizerPage'
import { AdminPage } from '@/pages/AdminPage'
import { BlogsPage } from '@/pages/BlogsPage'
import { BlogDetailPage } from '@/pages/BlogDetailPage'
import { useAuthStore } from '@/store/authStore'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.email?.toLowerCase() !== 'sarcasticsahal@gmail.com') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

import { ScrollToTop } from '@/components/common/ScrollToTop'

export default function App() {
  const initialize = useAuthStore(s => s.initialize)

  useEffect(() => { initialize() }, [initialize])

  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            <Route element={<AppLayout />}>
              {/* Public & Hybrid Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/learning-paths" element={<LearningPathsPage />} />
              <Route path="/learning-paths/:path" element={<LearningPathDetailPage />} />
              <Route path="/library" element={<TechnologyLibraryPage />} />
              <Route path="/library/:technology" element={<TechnologyDetailPage />} />
              <Route path="/topics/:slug" element={<TopicPage />} />
              <Route path="/ai-tutor" element={<AITutorPage />} />
              <Route path="/code-analyzer" element={<CodeAnalyzerPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quizzes/:id" element={<QuizDetailPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="/interview-prep/:slug" element={<InterviewPrepTopicPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
              <Route path="/revision" element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
              <Route path="/duel" element={<ProtectedRoute><DuelPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/resume-optimizer" element={<ProtectedRoute><ResumeOptimizerPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
