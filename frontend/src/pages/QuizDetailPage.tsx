import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { quizService } from '@/services/quizService'

export function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Array<{ questionId: string; selectedAnswer: number }>>([])
  const [done, setDone] = useState(false)

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getById(id!),
    enabled: !!id,
  })

  const submitMutation = useMutation({
    mutationFn: (ans: Array<{ questionId: string; selectedAnswer: number }>) =>
      quizService.submitAttempt(id!, ans),
  })

  const questions = useMemo(() => quiz?.questions ?? [], [quiz])
  const [current, setCurrent] = useState(0)
  const q = questions[current]

  const confirm = () => {
    if (selected === null || !q) return
    const correct = selected === q.correctAnswer
    const nextSelectedAnswers = [...selectedAnswers, { questionId: q.id, selectedAnswer: selected }]
    setAnswers(prev => [...prev, correct])
    setSelectedAnswers(nextSelectedAnswers)
    if (current + 1 >= questions.length) {
      setDone(true)
      submitMutation.mutate(nextSelectedAnswers)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const score = answers.filter(Boolean).length

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-2xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  if (!quiz) return (
    <div className="px-6 py-20 max-w-2xl mx-auto text-center">
      <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: 'var(--color-border-muted)' }}>error</span>
      <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Quiz not found</p>
      <Link to="/quizzes" className="text-sm" style={{ color: 'var(--color-primary)' }}>← Back to Quizzes</Link>
    </div>
  )

  if (done) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto text-center animate-fade-up">
        <div className="bento-card p-10">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5"
               style={{ background: score >= questions.length / 2 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
            <span className="material-symbols-outlined text-5xl" style={{ color: score >= questions.length / 2 ? 'var(--color-success)' : 'var(--color-error)', fontVariationSettings: "'FILL' 1" }}>
              {score >= questions.length / 2 ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-on-surface)' }}>{score}/{questions.length} Correct</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            {score === questions.length ? 'Perfect score! You\'ve mastered this topic.' : 'Good effort! Review the topics and try again.'}
          </p>
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setSelectedAnswers([]); setDone(false) }}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            Retry Quiz
          </button>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: 'var(--color-outline)' }}>Question {current + 1} of {questions.length}</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{Math.round((current / questions.length) * 100)}% complete</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--color-surface-container-high)' }}>
          <div className="h-full rounded-full progress-glow transition-all duration-500"
               style={{ width: `${(current / questions.length) * 100}%`, background: 'var(--color-primary)' }} />
        </div>
      </div>

      <div className="bento-card p-8 mb-5 animate-fade-up animation-delay-100">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>{q.text}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => setSelected(i)}
                    className="w-full text-left p-4 rounded-xl text-sm font-medium transition-all"
                    style={{
                      border: `1px solid ${selected === i ? 'var(--color-primary)' : 'var(--color-border-muted)'}`,
                      background: selected === i ? 'rgba(208,188,255,0.1)' : 'var(--color-surface-container)',
                      color: selected === i ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    }}>
              <span className="font-mono mr-3 text-xs" style={{ color: 'var(--color-outline)' }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button onClick={confirm} disabled={selected === null}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
        {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
        <span className="material-symbols-outlined text-[18px] ml-2 align-middle">arrow_forward</span>
      </button>
    </div>
  )
}
