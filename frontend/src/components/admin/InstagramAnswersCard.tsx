import type { CSSProperties } from 'react'
import logo from '@/assets/logo.png'

const SANS = "'Inter', system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const GRADIENT = 'linear-gradient(160deg, #050810 0%, #1b1233 50%, #251148 100%)'

const LETTERS = ['A', 'B', 'C', 'D']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export interface AnswerEntry {
  index: number
  text: string
  correctAnswer: number
}

interface InstagramAnswersCardProps {
  quizTitle: string
  topicTitle?: string
  answers: AnswerEntry[]
  style?: CSSProperties
}

export function InstagramAnswersCard({
  quizTitle,
  topicTitle: _topicTitle,
  answers,
  style,
}: InstagramAnswersCardProps) {
  const totalStr = pad(answers.length)

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
          top: 36,
          right: 48,
          fontSize: 24,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: 1,
          zIndex: 2,
        }}
      >
        ✓
      </div>
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,181,253,0.16), transparent 70%)',
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
            color: '#c4b5fd',
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 26,
          }}
        >
          {quizTitle}&nbsp;·&nbsp;Answers
        </div>

        <div
          style={{
            fontSize: 56,
            lineHeight: 1.24,
            fontWeight: 800,
            color: '#f7f9fc',
            marginBottom: 12,
            letterSpacing: -0.5,
            maxWidth: '90%',
          }}
        >
          Answer Key
        </div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 48 }}>
          {pad(answers.length)} Questions
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {answers.map((a) => (
            <div
              key={a.index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14,
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  flexShrink: 0,
                }}
              >
                {pad(a.index + 1)}
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 22,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  color: '#e9edf5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {a.text}
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(126,227,160,0.14)',
                  border: '1px solid rgba(126,227,160,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: MONO,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#7ee3a0',
                  flexShrink: 0,
                }}
              >
                {LETTERS[a.correctAnswer] ?? '?'}
              </div>
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
          ✓ / {totalStr}
        </span>
      </div>
    </div>
  )
}
