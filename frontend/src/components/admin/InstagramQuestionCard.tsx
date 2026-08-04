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
  const cleaned = text.replace(/```/g, '')
  const parts = cleaned.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <span
          key={i}
          style={{
            fontFamily: MONO,
            color: '#7ee3a0',
            background: 'rgba(126, 227, 160, 0.12)',
            padding: '2px 10px',
            borderRadius: 8,
            fontSize: '0.9em',
            display: 'inline-block',
          }}
        >
          {part.slice(1, -1)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function renderQuestion(text: string): ReactNode {
  const codeBlockMatch = text.match(/```(?:\w+)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    const mainQuestion = text.replace(/```(?:\w+)?\s*[\s\S]*?```/, '').trim()
    const codeSnippet = codeBlockMatch[1].trim()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>{highlightCode(mainQuestion)}</div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 28,
            lineHeight: 1.4,
            background: 'rgba(126, 227, 160, 0.08)',
            border: '1px solid rgba(126, 227, 160, 0.25)',
            color: '#7ee3a0',
            padding: '16px 22px',
            borderRadius: 14,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {codeSnippet}
        </div>
      </div>
    )
  }

  return highlightCode(text)
}

function getQuestionFontSize(text: string): number {
  const len = text.length
  if (len <= 50) return 52
  if (len <= 85) return 44
  if (len <= 120) return 38
  if (len <= 165) return 34
  return 30
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
            fontSize: getQuestionFontSize(question),
            lineHeight: 1.3,
            fontWeight: 800,
            color: '#f7f9fc',
            marginBottom: 32,
            letterSpacing: -0.5,
            width: '100%',
          }}
        >
          {renderQuestion(question)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                padding: '20px 30px',
                minHeight: 76,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#7dd3fc',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {LETTERS[i] ?? String(i + 1)}
              </div>
              <span
                style={{
                  fontSize: 28,
                  lineHeight: 1.25,
                  fontWeight: 500,
                  color: '#e9edf5',
                  display: 'flex',
                  alignItems: 'center',
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
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
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
