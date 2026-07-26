import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDuelSocket } from '@/services/socketService'
import { useDuelStore } from '@/store/duelStore'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

interface GameContent {
  type: 'quiz' | 'flashcard'
  questions: Question[]
  timeLimit: number
}

export function DuelBattlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const socket = getDuelSocket()
  const { opponentProgress, setDuelResult, setOpponentProgress } = useDuelStore()

  const [content, setContent] = useState<GameContent | null>(null)
  const [playerName, setPlayerName] = useState('Opponent')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [, setAnswers] = useState<Record<string, string>>({})
  const [myScore, setMyScore] = useState(0)
  const [theirScore, setTheirScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    socket.emit('duel:join', { duelId: id })

    socket.on('duel:content', (data: { content: GameContent; playerName: string }) => {
      setContent(data.content)
      setPlayerName(data.playerName)
      setTimeLeft(data.content.timeLimit)
    })

    socket.on('duel:opponent_progress', (data: { questionsAnswered: number; totalQuestions: number; score: number }) => {
      setOpponentProgress({ questionsAnswered: data.questionsAnswered, totalQuestions: data.totalQuestions })
      setTheirScore(data.score)
    })

    socket.on('duel:finished', (data) => {
      setDuelResult(data)
      navigate(`/duel/results/${data.duelId}`, { replace: true })
    })

    return () => {
      socket.off('duel:content')
      socket.off('duel:opponent_progress')
      socket.off('duel:finished')
    }
  }, [id, socket, navigate, setDuelResult, setOpponentProgress])

  const submitAnswer = useCallback((questionId: string, answer: string) => {
    socket.emit('duel:submit_answer', { duelId: id, questionId, answer })
    const q = content?.questions.find(q => q.id === questionId)
    if (q && answer === q.correctAnswer) {
      setMyScore(s => s + 1)
    }
    setAnswers(a => ({ ...a, [questionId]: answer }))
  }, [socket, id, content])

  const handleFinishEarly = () => {
    socket.emit('duel:finished_early', { duelId: id })
    setFinished(true)
  }

  const handleSelect = (ans: string) => {
    if (!content || selectedAnswer) return
    setSelectedAnswer(ans)
    const q = content.questions[currentIndex]
    submitAnswer(q.id, ans)
    setTimeout(() => {
      if (currentIndex < content.questions.length - 1) {
        setCurrentIndex(i => i + 1)
        setSelectedAnswer(null)
      } else {
        handleFinishEarly()
      }
    }, 800)
  }

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || finished) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          handleFinishEarly()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, finished])

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  const q = content.questions[currentIndex]
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto animate-fade-up">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>You</p>
          <p className="text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{myScore}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-2xl font-extrabold" style={{ color: 'var(--color-on-surface)' }}>VS</p>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Time: {timeLeft}s</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>{playerName}</p>
          <p className="text-2xl font-extrabold" style={{ color: 'var(--color-error)' }}>{theirScore}</p>
        </div>
      </div>

      {/* Opponent progress */}
      {opponentProgress && (
        <div className="mb-6 text-center">
          <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
            {playerName} answered {opponentProgress.questionsAnswered}/{opponentProgress.totalQuestions}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full mb-6" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / content.questions.length) * 100}%`, background: 'var(--color-primary)' }} />
      </div>
      <p className="text-xs text-center mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
        Question {currentIndex + 1} of {content.questions.length}
      </p>

      {/* Question */}
      <div className="bento-card p-8 mb-6">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>{q?.question}</h2>
        <div className="space-y-3">
          {q?.options.map(opt => {
            let style: React.CSSProperties = { background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }
            if (selectedAnswer) {
              if (opt === q.correctAnswer) style = { background: '#16a34a', color: '#ffffff' }
              else if (opt === selectedAnswer) style = { background: '#dc2626', color: '#ffffff' }
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={!!selectedAnswer}
                className="w-full p-4 rounded-xl text-left font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed"
                style={style}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Finish early */}
      <div className="text-center">
        <button onClick={handleFinishEarly}
                className="text-sm font-medium underline"
                style={{ color: 'var(--color-on-surface-variant)' }}>
          Finish Early
        </button>
      </div>
    </div>
  )
}
