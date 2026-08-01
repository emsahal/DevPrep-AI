import type { CSSProperties } from 'react'

export interface InstagramCardOption {
  letter: string
  text: string
}

interface InstagramQuestionCardProps {
  quizTitle: string
  topicTitle: string
  index: number
  total: number
  question: string
  options: string[]
  style?: CSSProperties
}

const GRADIENT = 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #5b21b6 100%)'

const LETTERS = ['A', 'B', 'C', 'D']

export function InstagramQuestionCard({
  quizTitle,
  topicTitle,
  index,
  total,
  question,
  options,
  style,
}: InstagramQuestionCardProps) {
  const optionsData: InstagramCardOption[] = options.map((text, i) => ({
    letter: LETTERS[i] ?? String(i + 1),
    text,
  }))

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '48px 60px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'rgba(255,255,255,0.12)',
            padding: '12px 22px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#a78bfa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: '#1e1b4b',
            }}
          >
            D
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>DevPrep</span>
        </div>
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#a78bfa',
            background: 'rgba(167,139,250,0.15)',
            padding: '12px 24px',
            borderRadius: 999,
          }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div style={{ padding: '36px 60px 0' }}>
        <div style={{ fontSize: 24, fontWeight: 500, color: '#c7d2fe' }}>
          {topicTitle || quizTitle}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '20px 60px',
          minHeight: 0,
        }}
      >
        <div
          style={{
            fontSize: 46,
            lineHeight: 1.3,
            fontWeight: 700,
            marginBottom: 28,
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {optionsData.map((opt) => (
            <div
              key={opt.letter}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                background: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 20,
                padding: '20px 26px',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: '#a78bfa',
                  color: '#1e1b4b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {opt.letter}
              </div>
              <div
                style={{
                  fontSize: 32,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {opt.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '34px 60px 52px',
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 600, color: '#c4b5fd' }}>
          @devprep.ai
        </span>
        <span style={{ fontSize: 24, fontWeight: 500, color: '#a5b4fc' }}>
          Question {index + 1}
        </span>
      </div>
    </div>
  )
}
