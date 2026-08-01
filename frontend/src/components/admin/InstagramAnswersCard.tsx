import type { CSSProperties } from 'react'

const GRADIENT = 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 55%, #a21caf 100%)'

const LETTERS = ['A', 'B', 'C', 'D']

export interface AnswerEntry {
  index: number
  text: string
  correctAnswer: number
}

interface InstagramAnswersCardProps {
  quizTitle: string
  topicTitle: string
  answers: AnswerEntry[]
  style?: CSSProperties
}

export function InstagramAnswersCard({
  quizTitle,
  topicTitle,
  answers,
  style,
}: InstagramAnswersCardProps) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: GRADIENT,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
        position: 'relative',
        ...style,
      }}
    >
      <div style={{ padding: '48px 60px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#f0abfc', letterSpacing: 0.5 }}>
          ANSWERS
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#e9d5ff',
            background: 'rgba(255,255,255,0.14)',
            padding: '10px 22px',
            borderRadius: 999,
          }}
        >
          @devprep.ai
        </span>
      </div>

      <div style={{ padding: '20px 60px 0' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#f5d0fe' }}>{quizTitle}</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: '#e9d5ff', marginTop: 4 }}>
          {topicTitle}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          padding: '28px 60px',
          alignContent: 'start',
          minHeight: 0,
        }}
      >
        {answers.map((a) => (
          <div
            key={a.index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 18,
              padding: '16px 20px',
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#4c1d95',
                background: '#f0abfc',
                width: 48,
                height: 48,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {a.index + 1}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 22,
                  lineHeight: 1.25,
                  fontWeight: 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {a.text}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#f0abfc', marginTop: 4 }}>
                {LETTERS[a.correctAnswer] ?? '?'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 60px 52px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 600, color: '#f5d0fe' }}>
          Which answer did you get right? Comment below! 👇
        </span>
      </div>
    </div>
  )
}
