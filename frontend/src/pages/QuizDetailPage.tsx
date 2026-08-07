import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { quizService, type QuizQuestion } from '@/services/quizService'
import { BackButton } from '@/components/common/BackButton'
import { SEOHead } from '@/components/common/SEOHead'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Array<{ questionId: string; selectedAnswer: number }>>([])
  const [done, setDone] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)

  const [aiExplanation, setAiExplanation] = useState('')
  const [isAiExplaining, setIsAiExplaining] = useState(false)

  const { data: quiz, isLoading: isMetadataLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getById(id!),
    enabled: !!id,
  })

  const submitMutation = useMutation({
    mutationFn: (ans: Array<{ questionId: string; selectedAnswer: number }>) =>
      quizService.submitAttempt(id!, ans),
  })

  useEffect(() => {
    if (!quiz) return

    if (quiz.isPlaceholder) {
      setQuestions([])
      setIsStreaming(true)
      setStreamError(null)

      quizService.streamQuizQuestions(
        id!,
        (newQuestion) => {
          setQuestions((prev) => {
            if (prev.some((q) => q.id === newQuestion.id)) return prev
            return [...prev, newQuestion]
          })
        },
        () => {
          setIsStreaming(false)
        }
      ).catch((err) => {
        console.error('Quiz streaming failed:', err)
        setStreamError('Failed to generate AI questions. Please reload.')
        setIsStreaming(false)
      })
    } else {
      setQuestions(quiz.questions || [])
      setIsStreaming(false)
    }
  }, [quiz, id])

  const [current, setCurrent] = useState(0)
  const q = questions[current]
  const currentCorrect = selected !== null && q ? selected === q.correctAnswer : false

  const resetCurrentQuestion = () => {
    setSelected(null)
    setAnswered(false)
    setAiExplanation('')

  }

  const handleSelect = (i: number) => {
    if (answered || isAiExplaining) return
    setSelected(i)
    setAnswered(true)
  }

  const handleAiExplain = () => {
    if (selected === null || !q || isAiExplaining) return
    setIsAiExplaining(true)
    setAiExplanation('')

    quizService.aiExplain(
      id!,
      {
        questionText: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: selected,
      },
      (chunk) => {
        setAiExplanation((prev) => prev + chunk)
      },
      () => {
        setIsAiExplaining(false)
      }
    ).catch((err) => {
      console.error('AI explain failed:', err)
      setIsAiExplaining(false)
      setAiExplanation('Failed to get AI explanation. Please try again.')
    })
  }

  const handleNext = () => {
    if (selected === null || !q) return

    const correct = selected === q.correctAnswer
    const nextSelectedAnswers = [...selectedAnswers, { questionId: q.id, selectedAnswer: selected }]
    setAnswers((prev) => [...prev, correct])
    setSelectedAnswers(nextSelectedAnswers)

    if (current + 1 >= questions.length) {
      setDone(true)
      submitMutation.mutate(nextSelectedAnswers)
    } else {
      setCurrent((c) => c + 1)
      resetCurrentQuestion()
    }
  }

  const handleRegenerate = () => {
    if (!id) return
    setCurrent(0)
    resetCurrentQuestion()
    setAnswers([])
    setSelectedAnswers([])
    setDone(false)
    setQuestions([])
    setIsStreaming(true)
    setStreamError(null)

    quizService.streamQuizQuestions(
      id,
      (newQuestion) => {
        setQuestions((prev) => {
          if (prev.some((q) => q.id === newQuestion.id)) return prev
          return [...prev, newQuestion]
        })
      },
      () => {
        setIsStreaming(false)
      },
      true
    ).catch((err) => {
      console.error('Quiz streaming failed:', err)
      setStreamError('Failed to generate AI questions. Please reload.')
      setIsStreaming(false)
    })
  }

  const score = answers.filter(Boolean).length

  if (isMetadataLoading || (quiz?.isPlaceholder && questions.length === 0 && !streamError)) {
    return (
      <div className="px-6 py-20 max-w-2xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-6">
          <span className="material-symbols-outlined text-5xl animate-spin" style={{ color: 'var(--color-primary)' }}>
            progress_activity
          </span>
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-md -z-10 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold mb-2 animate-pulse" style={{ color: 'var(--color-on-surface)' }}>
          Generating Real MCQs
        </h3>
        <p className="text-sm max-w-sm text-balance leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
          Our AI is dynamically crafting 15 high-quality software engineering questions with real-world code snippets...
        </p>
      </div>
    )
  }

  if (streamError) {
    return (
      <div className="px-6 py-20 max-w-2xl mx-auto text-center">
        <span className="material-symbols-outlined text-6xl mb-4 block text-error">error</span>
        <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{streamError}</p>
        <button onClick={() => window.location.reload()} className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
          Try Again
        </button>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="px-6 py-20 max-w-2xl mx-auto text-center">
        <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: 'var(--color-border-muted)' }}>
          error
        </span>
        <p className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-surface)' }}>Quiz not found</p>
        <BackButton to="/quizzes" label="Back to Quizzes" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto text-center animate-fade-up">
        <div className="bento-card p-10">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{
              background: score >= questions.length / 2 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            }}
          >
            <span
              className="material-symbols-outlined text-5xl"
              style={{
                color: score >= questions.length / 2 ? 'var(--color-success)' : 'var(--color-error)',
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {score >= questions.length / 2 ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            {score}/{questions.length} Correct
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            {score === questions.length
              ? "Perfect score! You've mastered this topic."
              : 'Good effort! Review the topics and try again.'}
          </p>
          <button
            onClick={() => {
              setCurrent(0)
              resetCurrentQuestion()
              setAnswers([])
              setSelectedAnswers([])
              setDone(false)
            }}
            className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
          >
            Retry Quiz
          </button>
          <button
            onClick={handleRegenerate}
            className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 ml-3 bg-surface-container hover:bg-surface-container-high"
            style={{ color: 'var(--color-on-surface)', border: '1px solid var(--color-border-muted)' }}
          >
            Regenerate Fresh Questions
          </button>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <>
      <SEOHead
        title={`${quiz.title || 'Interactive Quiz'} - DevPrep AI`}
        description={quiz.description || 'Test your knowledge with AI-crafted practice questions.'}
      />
      <div className="px-6 py-8 max-w-2xl mx-auto">
      {/* Back Link */}
      <div className="mb-6">
        <BackButton to="/quizzes" label="Back to Quizzes" />
      </div>

      {/* Header Info */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between text-xs mb-2">
          <span style={{ color: 'var(--color-outline)' }}>
            Question {current + 1} of {questions.length}
          </span>
          <span className="flex items-center gap-2">
            {isStreaming && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold animate-pulse"
                style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                Streaming: {questions.length}/15 questions loaded
              </span>
            )}
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {Math.round((current / questions.length) * 100)}% complete
            </span>
            <button
              onClick={handleRegenerate}
              title="Regenerate MCQs"
              className="p-1 rounded-lg transition-all hover:bg-surface-container-highest flex items-center justify-center text-outline hover:text-primary ml-1"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </button>
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--color-surface-container-high)' }}>
          <div
            className="h-full rounded-full progress-glow transition-all duration-500"
            style={{ width: `${(current / questions.length) * 100}%`, background: 'var(--color-primary)' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bento-card p-8 mb-5 animate-fade-up animation-delay-100">
        <div className="mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface)' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1({ children }) { return <h1 className="text-xl font-bold mb-4">{children}</h1> },
              h2({ children }) { return <h2 className="text-lg font-bold mb-3">{children}</h2> },
              p({ children }) { return <p className="mb-4 text-base font-medium leading-relaxed text-left">{children}</p> },
              strong({ children }) { return <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{children}</strong> },
              code({ className, children, ...props }) {
                const isInline = !className
                if (isInline) return <code className="px-1 py-0.5 rounded text-sm font-code" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-primary)', fontSize: '13px' }} {...props}>{children}</code>
                return (
                  <div className="rounded-xl overflow-hidden my-4 text-sm" style={{ border: '1px solid var(--color-border-muted)' }}>
                    <pre className="p-4 m-0 overflow-x-auto font-code text-left" style={{ background: 'var(--color-surface-container)', fontSize: '13px', lineHeight: '1.6' }}>
                      <code className={className} {...props}>{children}</code>
                    </pre>
                  </div>
                )
              }
            }}
          >
            {q.text.replace(/\\n/g, '\n')}
          </ReactMarkdown>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let optionStyle: React.CSSProperties = {
              border: '1px solid var(--color-border-muted)',
              background: 'var(--color-surface-container)',
              color: 'var(--color-on-surface-variant)',
            }

            if (answered) {
              if (i === q.correctAnswer) {
                optionStyle = {
                  border: '1px solid var(--color-success)',
                  background: 'rgba(16,185,129,0.12)',
                  color: 'var(--color-success)',
                }
              } else if (i === selected && i !== q.correctAnswer) {
                optionStyle = {
                  border: '1px solid var(--color-error)',
                  background: 'rgba(239,68,68,0.12)',
                  color: 'var(--color-error)',
                }
              }
            } else if (selected === i) {
              optionStyle = {
                border: '1px solid var(--color-primary)',
                background: 'rgba(208,188,255,0.1)',
                color: 'var(--color-primary)',
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className="w-full text-left p-4 rounded-xl text-sm font-medium transition-all hover:translate-x-0.5 disabled:hover:translate-x-0"
                style={optionStyle}
              >
                <span className="font-mono mr-3 text-xs" style={{ opacity: 0.6 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {answered && i === q.correctAnswer && (
                  <span className="material-symbols-outlined text-success ml-2 align-middle text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                )}
                {answered && i === selected && i !== q.correctAnswer && (
                  <span className="material-symbols-outlined text-error ml-2 align-middle text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    cancel
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Feedback after answering */}
        {answered && (
          <div className={`mt-5 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
            currentCorrect ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <span
              className="material-symbols-outlined text-[20px] mt-0.5"
              style={{
                color: currentCorrect ? 'var(--color-success)' : 'var(--color-error)',
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {currentCorrect ? 'check_circle' : 'cancel'}
            </span>
            <div>
              <strong style={{ color: currentCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
                {currentCorrect ? 'Correct!' : 'Incorrect'}
              </strong>
              <p className="mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                {currentCorrect
                  ? 'Great job! Click "Explain" to learn more about this answer.'
                  : `The correct answer is option ${String.fromCharCode(65 + q.correctAnswer)}. Click "Explain" to understand why.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Explanation Panel */}
      {aiExplanation && (
        <div className="bento-card p-6 mb-5 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-primary)' }}>
              psychology
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>
              AI Explanation
            </span>
            {isAiExplaining && (
              <span className="text-[11px] animate-pulse flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined text-[14px]">progress_activity</span>
                Thinking...
              </span>
            )}
          </div>
          <div className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface)' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = !className
                  if (isInline) return <code className="px-1 py-0.5 rounded text-sm font-code" style={{ background: 'var(--color-surface-container-high)', fontSize: '13px' }} {...props}>{children}</code>
                  return (
                    <div className="rounded-xl overflow-hidden my-3 text-sm" style={{ border: '1px solid var(--color-border-muted)' }}>
                      <pre className="p-4 m-0 overflow-x-auto font-code text-left" style={{ background: 'var(--color-surface-container)', fontSize: '13px', lineHeight: '1.6' }}>
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  )
                },
                p({ children }) { return <p className="mb-3 last:mb-0">{children}</p> },
              }}
            >
              {aiExplanation}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {answered && (
          <button
            onClick={handleAiExplain}
            disabled={isAiExplaining}
            className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5"
            style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', background: 'transparent' }}
          >
            {isAiExplaining ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            )}
            {isAiExplaining ? 'Thinking...' : 'AI Explain'}
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!answered}
          className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
        >
          {!answered ? (
            'Select an answer first'
          ) : (
            <>
              {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
    </>
  )
}
