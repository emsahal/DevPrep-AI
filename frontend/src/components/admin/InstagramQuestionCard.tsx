import type { CSSProperties, ReactNode } from 'react'
import logo from '@/assets/logo.png'

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

const SANS = "'Inter', system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const GRADIENT = 'linear-gradient(160deg, #050810 0%, #0a1826 50%, #0d2432 100%)'
const LETTERS = ['A', 'B', 'C', 'D']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function highlightCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <span key={i} style={{ color: '#7ee3a0' }}>
          {part.slice(1, -1)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function InstagramQuestionCard({
  quizTitle,
  topicTitle,
  index,
  total,
  question,
  options,
  style,
}: InstagramQuestionCardProps) {
  const label = topicTitle || quizTitle
  const number = pad(index + 1)
  const totalStr = pad(total)

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: GRADIENT,
        color: '#e6e8ef',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: SANS,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          position: 'absolute',
          top: -70,
          right: -30,
          fontSize: 480,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.045)',
          lineHeight: 1,
          letterSpacing: -20,
          zIndex: 0,
          userSelect: 'none',
        }}
      >
        {number}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(89,194,255,0.16), transparent 70%)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          fontFamily: MONO,
          position: 'absolute',
          top: 44,
          right: 48,
          fontSize: 24,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: 1,
          zIndex: 2,
        }}
      >
        {number}
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>/{totalStr}</span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 64px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 700,
            color: '#7dd3fc',
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 26,
          }}
        >
          {label}&nbsp;·&nbsp;Quiz
        </div>

        <div
          style={{
            fontSize: 56,
            lineHeight: 1.24,
            fontWeight: 800,
            color: '#f7f9fc',
            marginBottom: 56,
            letterSpacing: -0.5,
            maxWidth: '90%',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {highlightCode(question)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {options.map((text, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 18,
                padding: '26px 32px',
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#7dd3fc',
                  flexShrink: 0,
                }}
              >
                {LETTERS[i] ?? String(i + 1)}
              </div>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: '#e9edf5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          fontFamily: MONO,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 64px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={logo}
            alt="DevPrep AI logo"
            style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 10 }}
          />
          <span style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>
            devpreps.tech
          </span>
        </div>
        <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
          {number} / {totalStr}
        </span>
      </div>
    </div>
  )
}
