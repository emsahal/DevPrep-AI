import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { gamificationService } from '@/services/gamificationService'
import { NotificationDropdown } from '@/features/notifications/NotificationDropdown'
import logo from '@/assets/logo.png'
import { quizService, type QuizListItem } from '@/services/quizService'

const MOBILE_TABS = [
  { to: '/dashboard',      icon: 'dashboard',   label: 'Home'      },
  { to: '/learning-paths', icon: 'map',         label: 'Roadmaps'  },
  { to: '/library',        icon: 'menu_book',   label: 'Library'   },
  { to: '/interview-prep', icon: 'quiz',        label: 'Prep'      },
  { to: '/ai-tutor',       icon: 'smart_toy',   label: 'AI Tutor'  },
  { to: '/profile',        icon: 'person',      label: 'Profile'   },
]

export function TopNavBar() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Load quizzes when modal is opened
  useEffect(() => {
    if (isAddModalOpen) {
      quizService.getAll({ limit: 100 })
        .then((res) => {
          setQuizzes(res.data || [])
          if (res.data?.length > 0) {
            setSelectedQuizId(res.data[0].id)
          }
        })
        .catch((err) => {
          console.error('Failed to load quizzes for modal:', err)
        })
    }
  }, [isAddModalOpen])

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuizId || !questionText || !optionA || !optionB || !optionC || !optionD) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setIsSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await quizService.addCustomQuestion(selectedQuizId, {
        text: questionText,
        options: [optionA, optionB, optionC, optionD],
        correctAnswer,
        explanation: explanation || undefined,
      })
      setSuccessMsg('Question added successfully!')
      setQuestionText('')
      setOptionA('')
      setOptionB('')
      setOptionC('')
      setOptionD('')
      setCorrectAnswer(0)
      setExplanation('')
      
      setTimeout(() => {
        setIsAddModalOpen(false)
        setSuccessMsg('')
      }, 1500)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.response?.data?.message || 'Failed to add custom question.')
    } finally {
      setIsSaving(false)
    }
  }

  const { data: gamificationStats } = useQuery({
    queryKey: ['gamification', 'stats'],
    queryFn: () => gamificationService.getStats(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  })

  return (
    <>
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-6"
        style={{
          background: 'rgba(13,13,13,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="DevPrep AI logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            DevPrep<span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 rounded-xl px-3 py-2 gap-2 ai-glow-focus transition-all"
             style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-muted)' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
          <input
            type="text"
            placeholder="Search topics, roadmaps…"
            className="bg-transparent border-none outline-none w-full text-sm"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}
          />
          <kbd className="text-[10px] px-1 rounded border" style={{ color: 'var(--color-outline)', borderColor: 'var(--color-border-muted)', fontFamily: 'var(--font-mono)' }}>
            ⌘K
          </kbd>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle mobile */}
          <button
            className="md:hidden material-symbols-outlined text-[22px] transition-colors hover:text-primary"
            style={{ color: 'var(--color-on-surface-variant)' }}
            onClick={() => setSearchOpen(v => !v)}
          >
            search
          </button>

          {isAuthenticated ? (
            <>
              {/* Add Question Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-primary hover:opacity-90 active:scale-95 mr-1.5"
                style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span className="hidden sm:inline">Add Question</span>
              </button>

              {/* Streak */}
              <Link to="/leaderboard" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-80"
                   style={{ background: 'var(--color-tertiary-container)/20', color: 'var(--color-tertiary)' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span>{gamificationStats?.currentStreak ?? 0}</span>
              </Link>
              {/* Level badge */}
              {gamificationStats && (
                <Link to="/leaderboard" className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:opacity-80"
                     style={{ background: 'var(--color-primary)/15', color: 'var(--color-primary)' }}>
                  Lvl {gamificationStats.level}
                </Link>
              )}
              <NotificationDropdown />
              {/* Avatar */}
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer ring-2 ring-offset-2 transition-all hover:ring-primary"
                     style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                    className="px-4 py-1.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-container-low"
                    style={{ color: 'var(--color-on-surface-variant)' }}>
                Log in
              </Link>
              <Link to="/register"
                    className="px-4 py-1.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile search bar (collapsible) */}
      {searchOpen && (
        <div className="fixed top-16 left-0 w-full z-50 px-4 py-3 md:hidden"
             style={{ background: 'var(--color-surface-container-low)', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2"
               style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
            <input autoFocus type="text" placeholder="Search topics, roadmaps…"
                   className="bg-transparent border-none outline-none flex-1 text-sm"
                   style={{ color: 'var(--color-on-surface)' }} />
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex lg:hidden"
           style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--color-border-subtle)' }}>
        {MOBILE_TABS.map(({ to, icon, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
          return (
            <Link key={to} to={to} className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors"
                  style={{ color: active ? 'var(--color-primary)' : 'var(--color-outline)' }}>
              <span className="material-symbols-outlined text-[22px] leading-none"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span className="text-[10px] font-medium" style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Add Custom Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bento-card w-full max-w-xl p-6 rounded-2xl overflow-y-auto max-h-[90vh] shadow-2xl animate-scale-up"
               style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
            
            <div className="flex items-center justify-between mb-4 border-b border-border-muted pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Add Custom Question
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {successMsg && (
              <div className="p-3 mb-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-success/10 text-success border border-success/20 animate-pulse">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-error/10 text-error border border-error/20">
                <span className="material-symbols-outlined text-sm">error</span>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--color-outline)' }}>Select Topic / Quiz *</label>
                <select
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-sm bg-surface-container-high border border-border-muted outline-none focus:border-primary transition-colors text-on-surface"
                  style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                >
                  {quizzes.map((qz) => (
                    <option key={qz.id} value={qz.id}>
                      [{qz.difficulty.toUpperCase()}] {qz.topic?.title || qz.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--color-outline)' }}>Question Text *</label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. What will be the output of this code snippet? Supports markdown!"
                  className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                  style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-outline)' }}>Option A *</label>
                  <input
                    required
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="First option"
                    className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                    style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-outline)' }}>Option B *</label>
                  <input
                    required
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="Second option"
                    className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                    style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-outline)' }}>Option C *</label>
                  <input
                    required
                    type="text"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    placeholder="Third option"
                    className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                    style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-outline)' }}>Option D *</label>
                  <input
                    required
                    type="text"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    placeholder="Fourth option"
                    className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                    style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--color-outline)' }}>Correct Option *</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                  style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--color-outline)' }}>Explanation</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the correct option is right..."
                  className="w-full p-2.5 rounded-xl text-sm outline-none focus:border-primary text-on-surface"
                  style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-muted">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors"
                  style={{ color: 'var(--color-outline)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ color: 'var(--color-on-primary-fixed)' }}
                >
                  {isSaving ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
