import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, ChevronRight, RefreshCw } from 'lucide-react'
import type { TopicQuiz } from '@/services/topicService'

interface QuizSectionProps {
  quiz: TopicQuiz
}

export function QuizSection({ quiz }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const question = quiz.questions[currentQuestion]

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompleted(false)
  }

  if (completed) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    return (
      <div className="text-center py-8">
        <div className={cn(
          'mb-4 inline-flex rounded-full p-4',
          percentage >= 70 ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
        )}>
          {percentage >= 70
            ? <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            : <XCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          }
        </div>
        <h3 className="text-xl font-bold">Quiz Complete!</h3>
        <p className="mt-2 text-muted-foreground">
          You scored {score} out of {quiz.questions.length} ({percentage}%)
        </p>
        {percentage >= 70 ? (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">Great job! You passed.</p>
        ) : (
          <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">Keep practicing to improve.</p>
        )}
        <Button variant="outline" className="mt-6" onClick={handleRestart}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry Quiz
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
        <Badge variant="outline" className="text-xs">
          Score: {score}
        </Badge>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium">{question.text}</h4>
      </div>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer
          const isSelected = index === selectedAnswer

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={cn(
                'w-full rounded-lg border p-4 text-left transition-colors',
                !showResult && 'hover:bg-accent hover:border-primary',
                showResult && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950',
                showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950',
                showResult && !isCorrect && !isSelected && 'opacity-50'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm">{option}</span>
                {showResult && isCorrect && (
                  <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-green-500" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="ml-auto h-5 w-5 shrink-0 text-red-500" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {showResult && (
        <div className="mt-4 space-y-4">
          {question.explanation && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium mb-1">Explanation:</p>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}
          <Button onClick={handleNext} className="w-full">
            {currentQuestion < quiz.questions.length - 1 ? (
              <>Next Question <ChevronRight className="ml-2 h-4 w-4" /></>
            ) : (
              'See Results'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
