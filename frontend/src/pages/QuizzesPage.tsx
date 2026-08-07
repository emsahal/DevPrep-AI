import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { quizService } from '@/services/quizService'
import { TechLogo } from '@/components/common/TechLogo'

const DIFF_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: 'rgba(34, 197, 94, 0.12)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  intermediate: { bg: 'rgba(234, 179, 8, 0.12)', text: '#FACC15', border: 'rgba(234, 179, 8, 0.3)' },
  advanced: { bg: 'rgba(239, 68, 68, 0.12)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  mixed: { bg: 'rgba(168, 85, 247, 0.12)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' },
}

export function QuizzesPage() {
  const [filter, setFilter] = useState('All')
  const [customTopic, setCustomTopic] = useState('')
  const [quizType, setQuizType] = useState('custom')
  const [difficulty, setDifficulty] = useState('mixed')
  const [questionCount, setQuestionCount] = useState(15)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const { data: response, isLoading } = useQuery<any>({
    queryKey: ['quizzes', page],
    queryFn: () => quizService.getAll({ page }),
  })

  const quizzes = response?.data ?? []
  const pagination = response?.pagination

  const tags: string[] = ['All', ...new Set(quizzes.map((q: any) => q.topic?.technology?.name ?? q.topic?.title ?? '').filter(Boolean) as string[])]

  const filtered = filter === 'All'
    ? quizzes
    : quizzes.filter((q: any) => (q.topic?.technology?.name === filter || q.topic?.title === filter))

  const createQuizMutation = useMutation({
    mutationFn: () => quizService.createAIQuiz({
      customTopic,
      quizType,
      difficulty,
      questionCount,
    }),
    onSuccess: (quiz) => {
      navigate(`/quizzes/${quiz.id}`)
    },
  })

  const handleCreateQuiz = (event: FormEvent) => {
    event.preventDefault()
    if (!customTopic.trim() || createQuizMutation.isPending) return
    createQuizMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-7xl mx-auto text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(208,188,255,0.08)', border: '1px solid rgba(208,188,255,0.2)' }}>
          <span className="material-symbols-outlined text-3xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Loading quizzes and assessment challenges...</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative mb-10 overflow-hidden rounded-3xl p-8 animate-fade-up"
           style={{
             background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
             border: '1px solid rgba(208, 188, 255, 0.15)',
             boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
           }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4"
               style={{ background: 'rgba(208,188,255,0.12)', color: 'var(--color-primary)', border: '1px solid rgba(208,188,255,0.25)' }}>
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Adaptive AI Quiz Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            Assessment Center
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            Practice interactive, AI-tuned technical quizzes designed to sharpen your coding reflexes and prepare you for real-world interview challenges.
          </p>
        </div>
      </div>

      {/* AI Quiz Generation Form */}
      <form onSubmit={handleCreateQuiz}
            className="bento-card ai-glow-border p-6 mb-10 rounded-3xl animate-fade-up animation-delay-100"
            style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-muted)' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(208, 188, 255, 0.12)', border: '1px solid rgba(208,188,255,0.2)' }}>
              <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)' }}>auto_awesome</span>
            </div>
            <div>
              <h2 className="font-extrabold text-xl" style={{ color: 'var(--color-on-surface)' }}>Create Custom AI Quiz</h2>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Generate instant, saved quizzes on any topic using Gemini AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="relative">
              <input
                value={customTopic}
                onChange={event => setCustomTopic(event.target.value)}
                placeholder="Enter any topic (e.g., 'MySQL Replication', 'React Hooks', 'System Design')..."
                className="w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                style={{
                  background: 'var(--color-surface-container)',
                  border: '1px solid var(--color-border-muted)',
                  color: 'var(--color-on-surface)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            {createQuizMutation.isError && (
              <p className="text-xs mt-2 font-medium" style={{ color: 'var(--color-error)' }}>
                ⚠️ Could not generate quiz right now. Please verify topic name and try again.
              </p>
            )}
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Type
              </label>
              <select value={quizType} onChange={event => setQuizType(event.target.value)}
                      className="w-full rounded-xl px-3.5 py-3 text-xs font-semibold outline-none cursor-pointer"
                      style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
                <option value="custom">⚡ Custom</option>
                <option value="mega">🔥 Mega Quiz</option>
                <option value="interview">🎯 Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Difficulty
              </label>
              <select value={difficulty} onChange={event => setDifficulty(event.target.value)}
                      className="w-full rounded-xl px-3.5 py-3 text-xs font-semibold outline-none cursor-pointer"
                      style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
                <option value="mixed">🔀 Mixed</option>
                <option value="beginner">🌱 Beginner</option>
                <option value="intermediate">🚀 Intermediate</option>
                <option value="advanced">🔥 Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Questions
              </label>
              <select value={questionCount} onChange={event => setQuestionCount(Number(event.target.value))}
                      className="w-full rounded-xl px-3.5 py-3 text-xs font-semibold outline-none cursor-pointer"
                      style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
                <option value={15}>15 Questions</option>
                <option value={25}>25 Questions</option>
                <option value={40}>40 Questions</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-12 mt-2">
            <button type="submit" disabled={!customTopic.trim() || createQuizMutation.isPending}
                    className="w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] disabled:opacity-40"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, #9333EA 100%)',
                      color: 'var(--color-on-primary-fixed)',
                      boxShadow: '0 8px 25px -6px rgba(147, 51, 234, 0.4)'
                    }}>
              {createQuizMutation.isPending ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  Generating AI Quiz...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  Generate Quiz Now
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 mb-6 animate-fade-up animation-delay-200">
        <h3 className="font-extrabold text-xl" style={{ color: 'var(--color-on-surface)' }}>Explore Quizzes</h3>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {tags.map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200"
                    style={{
                      background: filter === f ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                      color: filter === f ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                      border: filter === f ? 'none' : '1px solid var(--color-border-muted)',
                      boxShadow: filter === f ? '0 4px 12px rgba(147,51,234,0.3)' : 'none'
                    }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up animation-delay-300">
        {filtered.map((quiz: any) => {
          const diffStyle = DIFF_COLOR[quiz.difficulty?.toLowerCase()] || DIFF_COLOR.mixed
          const techSlug = quiz.topic?.technology?.slug
          const techIcon = quiz.topic?.technology?.icon

          return (
            <div key={quiz.id} className="bento-card ai-glow-border group p-6 flex flex-col justify-between rounded-3xl transition-all duration-300 hover:-translate-y-1"
                 style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-border-muted)' }}>
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                        style={{ background: diffStyle.bg, color: diffStyle.text, border: `1px solid ${diffStyle.border}` }}>
                    {quiz.difficulty}
                  </span>
                  
                  {techSlug ? (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                      <TechLogo slug={techSlug} icon={techIcon} size={22} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(208, 188, 255, 0.1)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)' }}>quiz</span>
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-lg leading-snug mb-2 group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>
                  {quiz.title}
                </h3>
                {quiz.description && (
                  <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {quiz.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-2" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
                <div className="flex items-center justify-between text-xs font-semibold mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>help_outline</span>
                    {quiz.questionCount} Questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-warning)' }}>timer</span>
                    {Math.round(quiz.timeLimit / 60)} mins
                  </span>
                </div>

                <Link to={`/quizzes/${quiz.id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Start Quiz
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center rounded-3xl" style={{ background: 'var(--color-surface-container-low)', border: '1px dashed var(--color-border-muted)' }}>
            <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-outline)' }}>search_off</span>
            <h4 className="font-bold text-base mb-1" style={{ color: 'var(--color-on-surface)' }}>No Quizzes Found</h4>
            <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Try selecting another topic filter or create a custom AI quiz above.</p>
          </div>
        )}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-30 flex items-center gap-1"
                  style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined text-base">chevron_left</span> Previous
          </button>
          <span className="px-4 py-2 text-xs font-extrabold rounded-xl" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)' }}>
            {page} / {pagination.totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-30 flex items-center gap-1"
                  style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
            Next <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}