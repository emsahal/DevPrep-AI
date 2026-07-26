import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { duelService } from '@/services/duelService'
import { useDuelStore } from '@/store/duelStore'
import { useToast } from '@/providers/ToastProvider'
import { CodingEditor } from '@/features/duel/components/CodingEditor'

interface Question {
  id: string
  question: string
  options?: string[]
  correctAnswer?: string
}

interface CodingChallenge {
  id: string
  title: string
  description: string
  starterCode: string
  language: string
  testCases: { input: string; expected: string }[]
}

interface GameContent {
  type: 'quiz' | 'flashcard' | 'coding'
  questions?: Question[]
  challenge?: CodingChallenge
  timeLimit: number
}

export function DuelBattlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { opponentProgress, setDuelResult, setOpponentProgress } = useDuelStore()

  const [content, setContent] = useState<GameContent | null>(null)
  const [opponentName, setOpponentName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [, setAnswers] = useState<Record<string, string>>({})
  const [myScore, setMyScore] = useState(0)
  const [theirScore, setTheirScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [finished, setFinished] = useState(false)

  // Load duel data and start polling for opponent progress / results
  useEffect(() => {
    if (!id) return

    let isMounted = true

    const loadDuel = async () => {
      try {
        const data = await duelService.getDuel(id)
        if (!isMounted) return

        setContent(data.content)
        setOpponentName(data.opponent?.name || 'Opponent')

        // Compute remaining time based on when the duel started and the content's time limit
        const elapsedSeconds = Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 1000)
        const timeLimit = data.content?.timeLimit || 180
        setTimeLeft(Math.max(timeLimit - elapsedSeconds, 0))

        if (data.opponentProgress) {
          setOpponentProgress({
            questionsAnswered: data.opponentProgress.questionsAnswered,
            totalQuestions: data.content?.questions?.length || 1,
          })
        }

        // If duel is already finished, go to results
        if (data.status === 'finished') {
          const result = await duelService.finishDuel(id)
          setDuelResult(result)
          navigate(`/duel/results/${id}`, { replace: true })
        }
      } catch (err: any) {
        toast({ type: 'error', title: 'Error loading battle', message: err.response?.data?.message || err.message })
      }
    }

    loadDuel()

    // Poll every 3 seconds
    const pollInterval = setInterval(async () => {
      try {
        const data = await duelService.getDuel(id)
        if (!isMounted) return

        if (data.opponentProgress) {
          setOpponentProgress({
            questionsAnswered: data.opponentProgress.questionsAnswered,
            totalQuestions: data.content?.questions?.length || 1,
          })
        }

        if (data.status === 'finished') {
          clearInterval(pollInterval)
          const result = await duelService.finishDuel(id)
          setDuelResult(result)
          navigate(`/duel/results/${id}`, { replace: true })
        }
      } catch (err) {
        // silently fail polling errors
      }
    }, 3000)

    return () => {
      isMounted = false
      clearInterval(pollInterval)
    }
  }, [id, navigate, setDuelResult, setOpponentProgress, toast])

  const submitAnswer = useCallback(async (questionId: string, answer: string) => {
    const q = content?.questions?.find(q => q.id === questionId)
    if (q && answer === q.correctAnswer) {
      setMyScore(s => s + 1)
    }
    setAnswers(a => ({ ...a, [questionId]: answer }))
    try {
      await duelService.submitAnswer(id!, questionId, answer)
    } catch (err: any) {
      toast({ type: 'error', title: 'Submission failed', message: err.message })
    }
  }, [id, content, toast])

  const handleSelect = (ans: string) => {
    if (!content || selectedAnswer || content.type === 'coding') return
    setSelectedAnswer(ans)
    const q = content.questions?.[currentIndex]
    if (q) submitAnswer(q.id, ans)
    setTimeout(() => {
      if (content.questions && currentIndex < content.questions.length - 1) {
        setCurrentIndex(i => i + 1)
        setSelectedAnswer(null)
      } else {
        handleFinishEarly()
      }
    }, 800)
  }

  const handleFinishEarly = async () => {
    setFinished(true)
    try {
      const result = await duelService.finishDuel(id!)
      setDuelResult(result)
      navigate(`/duel/results/${id}`, { replace: true })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to complete battle', message: err.message })
    }
  }

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || finished) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleFinishEarly(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, finished])

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-5xl mb-4 block" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Joining duel...</p>
        </div>
      </div>
    )
  }

  // Coding battle
  if (content.type === 'coding' && content.challenge) {
    return (
      <CodingBattleView
        challenge={content.challenge}
        timeLeft={timeLeft}
        myScore={myScore}
        theirScore={theirScore}
        opponentName={opponentName}
        opponentProgress={opponentProgress}
        onFinish={handleFinishEarly}
        onSubmitAnswer={submitAnswer}
        duelId={id}
      />
    )
  }

  // Quiz / Flashcard battle
  const q = content.questions?.[currentIndex]

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>You</p>
          <p className="text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{myScore}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-2xl font-extrabold" style={{ color: 'var(--color-on-surface)' }}>VS</p>
          <p className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color: 'var(--color-outline)' }}>Time: {timeLeft}s</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>{opponentName}</p>
          <p className="text-2xl font-extrabold" style={{ color: 'var(--color-error)' }}>{theirScore}</p>
        </div>
      </div>

      {opponentProgress && (
        <div className="mb-4 text-center">
          <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
            {opponentName} answered {opponentProgress.questionsAnswered}/{opponentProgress.totalQuestions}
          </p>
        </div>
      )}

      <div className="w-full h-2 rounded-full mb-4" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / (content.questions?.length || 1)) * 100}%`, background: 'var(--color-primary)' }} />
      </div>
      <p className="text-xs text-center mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
        Question {currentIndex + 1} of {content.questions?.length || 0}
      </p>

      <div className="bento-card p-8 mb-6">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>{q?.question}</h2>
        <div className="space-y-3">
          {q?.options?.map(opt => {
            let bg = 'var(--color-surface-container-low)'
            let text = 'var(--color-on-surface)'
            if (selectedAnswer) {
              if (opt === q.correctAnswer) { bg = '#16a34a'; text = '#ffffff' }
              else if (opt === selectedAnswer) { bg = '#dc2626'; text = '#ffffff' }
            }
            return (
              <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selectedAnswer}
                      className="w-full p-4 rounded-xl text-left font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed"
                      style={{ background: bg, color: text }}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <button onClick={handleFinishEarly} className="text-sm font-medium underline"
                style={{ color: 'var(--color-on-surface-variant)' }}>
          Finish Early
        </button>
      </div>
    </div>
  )
}

function CodingBattleView({
  challenge, timeLeft, myScore, theirScore, opponentName, opponentProgress, onFinish, onSubmitAnswer,
}: {
  challenge: CodingChallenge
  timeLeft: number
  myScore: number
  theirScore: number
  opponentName: string
  opponentProgress: { questionsAnswered: number; totalQuestions: number } | null
  onFinish: () => void
  onSubmitAnswer: (questionId: string, answer: string) => Promise<void>
  duelId: string | undefined
}) {
  const [code, setCode] = useState(challenge.starterCode)
  const [output, setOutput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const runCode = async () => {
    setOutput('Running...')
    try {
      const res = await fetch('/api/duels/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          language: challenge.language,
          code,
          testCases: challenge.testCases,
        }),
      })
      const data = await res.json()
      setOutput(data.output || data.error || 'No output')
      if (data.passed !== undefined) {
        await onSubmitAnswer(
          challenge.id,
          JSON.stringify({ code, passed: data.passed, total: data.total })
        )
      }
    } catch {
      setOutput('Error running code')
    }
  }

  const submit = async () => {
    setSubmitting(true)
    await runCode()
    setSubmitting(false)
    onFinish()
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>You</p>
            <p className="text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{myScore}</p>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--color-on-surface)' }}>VS</p>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>{opponentName}</p>
            <p className="text-xl font-extrabold" style={{ color: 'var(--color-error)' }}>{theirScore}</p>
            {opponentProgress && (
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                {opponentProgress.questionsAnswered}/{opponentProgress.totalQuestions} done
              </p>
            )}
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-lg" style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <button onClick={onFinish}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
          Finish
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Problem + Editor */}
        <div className="flex flex-col min-h-0">
          <div className="bento-card p-4 mb-3 overflow-y-auto flex-shrink-0 max-h-[30%]">
            <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-on-surface)' }}>{challenge.title}</h3>
            <p className="text-xs whitespace-pre-wrap" style={{ color: 'var(--color-on-surface-variant)' }}>{challenge.description}</p>
          </div>
          <div className="flex-1 min-h-0 bento-card overflow-hidden">
            <CodingEditor
              code={code}
              onChange={setCode}
              language={challenge.language}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col min-h-0">
          <div className="bento-card p-4 flex-1 overflow-y-auto mb-3">
            <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-on-surface)' }}>Output</h3>
            <pre className="text-xs whitespace-pre-wrap font-mono" style={{ color: 'var(--color-on-surface-variant)' }}>
              {output || 'Click "Run Code" to test your solution'}
            </pre>
          </div>
          <div className="flex gap-2">
            <button onClick={runCode} disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
              Run Code
            </button>
            <button onClick={submit} disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
