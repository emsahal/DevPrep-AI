import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { quizService } from '@/services/quizService'


const DIFF_COLOR: Record<string, string> = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-error)',
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

  const tags: string[] = ['All', ...new Set(quizzes.map((q: any) => q.topic?.title ?? '').filter(Boolean) as string[])]

  const filtered = filter === 'All'
    ? quizzes
    : quizzes.filter((q: any) => q.topic?.title === filter)

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
      <div className="px-6 py-20 max-w-6xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>Assessment Center</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>AI-generated quizzes tuned to your current skill level.</p>
      </div>

      <form onSubmit={handleCreateQuiz}
            className="bento-card ai-glow-border p-5 mb-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 animate-fade-up animation-delay-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)' }}>auto_awesome</span>
            <h2 className="font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>Create Custom AI Quiz</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-outline)' }}>
            Type any topic, like "debouncing and throttling", and Gemini will create a saved quiz.
          </p>
          <input
            value={customTopic}
            onChange={event => setCustomTopic(event.target.value)}
            placeholder="Enter custom topic..."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}
          />
          {createQuizMutation.isError && (
            <p className="text-xs mt-2" style={{ color: 'var(--color-error)' }}>
              Could not create quiz. Check Gemini quota/API key and try again.
            </p>
          )}
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-[120px_120px_120px] gap-2 items-end">
          <label className="text-xs" style={{ color: 'var(--color-outline)' }}>
            Type
            <select value={quizType} onChange={event => setQuizType(event.target.value)}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
              <option value="custom">Custom</option>
              <option value="mega">Mega</option>
              <option value="interview">Interview</option>
            </select>
          </label>
          <label className="text-xs" style={{ color: 'var(--color-outline)' }}>
            Difficulty
            <select value={difficulty} onChange={event => setDifficulty(event.target.value)}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
              <option value="mixed">Mixed</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="text-xs" style={{ color: 'var(--color-outline)' }}>
            Questions
            <select value={questionCount} onChange={event => setQuestionCount(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={40}>40</option>
            </select>
          </label>
          <button type="submit" disabled={!customTopic.trim() || createQuizMutation.isPending}
                  className="col-span-3 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            {createQuizMutation.isPending ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 mb-6 animate-fade-up animation-delay-200">
        {tags.slice(0, 6).map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{
                    background: filter === f ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                    color: filter === f ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                    border: filter === f ? 'none' : '1px solid var(--color-border-muted)',
                  }}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up animation-delay-300">
        {filtered.map((quiz: any) => (
          <div key={quiz.id} className="bento-card ai-glow-border group p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="pill" style={{ background: `${DIFF_COLOR[quiz.difficulty] || 'var(--color-outline)'}20`, color: DIFF_COLOR[quiz.difficulty] || 'var(--color-outline)', border: `1px solid ${DIFF_COLOR[quiz.difficulty] || 'var(--color-outline)'}30` }}>
                    {quiz.difficulty}
                  </span>
              
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>{quiz.title}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary)/15' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>quiz</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-outline)' }}>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">help_outline</span>{quiz.questionCount} questions</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{Math.round(quiz.timeLimit / 60)} min</span>
            </div>
            <Link to={`/quizzes/${quiz.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Start Quiz <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>quiz</span>
            <p style={{ color: 'var(--color-outline)' }}>No quizzes available yet.</p>
          </div>
        )}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}