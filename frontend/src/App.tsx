import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
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
import { InterviewPrepTopicPage } from '@/pages/InterviewPrepTopicPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useAuthStore } from '@/store/authStore'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/QueryProvider'

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

export default function App() {
  const initialize = useAuthStore(s => s.initialize)

  useEffect(() => { initialize() }, [initialize])

  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

              <Route path="/learning-paths" element={<LearningPathsPage />} />
              <Route path="/learning-paths/:path" element={<LearningPathDetailPage />} />
              <Route path="/library" element={<TechnologyLibraryPage />} />
              <Route path="/library/:technology" element={<TechnologyDetailPage />} />
              <Route path="/topics/:slug" element={<TopicPage />} />
              <Route path="/ai-tutor" element={<ProtectedRoute><AITutorPage /></ProtectedRoute>} />
              <Route path="/code-analyzer" element={<ProtectedRoute><CodeAnalyzerPage /></ProtectedRoute>} />
              <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
              <Route path="/quizzes/:id" element={<ProtectedRoute><QuizDetailPage /></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
              <Route path="/revision" element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="/interview-prep/:slug" element={<InterviewPrepTopicPage />} />
              <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}
