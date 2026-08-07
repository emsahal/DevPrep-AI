import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { quizService } from '@/services/quizService'
import { TechLogo } from '@/components/common/TechLogo'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
      {/* Page Title Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
          Assessment Center
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          AI-generated quizzes tuned to your current skill level.
        </p>
      </div>

      {/* AI Quiz Generation Form - 2 Sided (Left & Right) */}
      <form onSubmit={handleCreateQuiz}
            className="bento-card hover:border-primary p-6 mb-8 rounded-2xl animate-fade-up animation-delay-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start transition-all duration-300">
        {/* Left Side: Title & Custom Topic Input */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>auto_awesome</span>
              <h2 className="font-extrabold text-xl" style={{ color: 'var(--color-on-surface)' }}>Create Custom AI Quiz</h2>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
              Type any topic, like "debouncing and throttling", and Gemini will create a saved quiz.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              value={customTopic}
              onChange={event => setCustomTopic(event.target.value)}
              placeholder="Enter custom topic..."
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
              style={{
                background: 'var(--color-surface-container)',
                color: 'var(--color-on-surface)'
              }}
            />
            {createQuizMutation.isError && (
              <p className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>
                Could not create quiz. Check Gemini quota/API key and try again.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Shadcn Select Dropdowns & Submit Button */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-0.5" style={{ color: 'var(--color-outline)' }}>
                Type
              </label>
              <Select value={quizType} onValueChange={setQuizType}>
                <SelectTrigger className="border-none shadow-none focus:ring-0">
                  <SelectValue placeholder="Custom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="mega">Mega</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-0.5" style={{ color: 'var(--color-outline)' }}>
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="border-none shadow-none focus:ring-0">
                  <SelectValue placeholder="Mixed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 ml-0.5" style={{ color: 'var(--color-outline)' }}>
                Questions
              </label>
              <Select value={String(questionCount)} onValueChange={val => setQuestionCount(Number(val))}>
                <SelectTrigger className="border-none shadow-none focus:ring-0">
                  <SelectValue placeholder="15" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button type="submit" disabled={!customTopic.trim() || createQuizMutation.isPending}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 border-none outline-none"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            {createQuizMutation.isPending ? 'Creating...' : 'Create Quiz'}
          </button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up animation-delay-300">
        {filtered.map((quiz: any) => {
          const diffStyle = DIFF_COLOR[quiz.difficulty?.toLowerCase()] || DIFF_COLOR.mixed
          const techSlug = quiz.topic?.technology?.slug
          const techIcon = quiz.topic?.technology?.icon

          return (
            <div key={quiz.id} className="bento-card group p-6 flex flex-col justify-between rounded-2xl hover:border-primary transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                        style={{ background: diffStyle.bg, color: diffStyle.text, border: `1px solid ${diffStyle.border}` }}>
                    {quiz.difficulty}
                  </span>

                  {techSlug ? (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                      <TechLogo slug={techSlug} icon={techIcon} size={22} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(208, 188, 255, 0.12)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)' }}>quiz</span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>
                  {quiz.title}
                </h3>
                {quiz.description && (
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {quiz.description}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-4 text-xs font-medium mb-4" style={{ color: 'var(--color-outline)' }}>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>help_outline</span>
                    {quiz.questionCount} questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-warning)' }}>schedule</span>
                    {Math.round(quiz.timeLimit / 60)} min
                  </span>
                </div>

                <Link to={`/quizzes/${quiz.id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Start Quiz <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
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