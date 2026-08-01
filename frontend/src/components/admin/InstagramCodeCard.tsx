import type { CSSProperties } from 'react'
import logo from '@/assets/logo.png'

const SANS = "'Inter', system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const GRADIENT = 'linear-gradient(160deg, #050810 0%, #0a1f1a 50%, #0d2b21 100%)'
const ACCENT = '#7fd88f'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function cleanQuestion(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateQuestion(text: string, max = 150): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

interface InstagramCodeCardProps {
  topicTitle: string
  index: number
  total: number
  question: string
  code: string[]
  style?: CSSProperties
}

export function InstagramCodeCard({
  topicTitle,
  index,
  total,
  question,
  code,
  style,
}: InstagramCodeCardProps) {
  const number = pad(index + 1)
  const totalStr = pad(total)
  const displayQuestion = truncateQuestion(cleanQuestion(question))

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
          background: 'radial-gradient(circle, rgba(127,216,143,0.12), transparent 70%)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 64px 36px',
          position: 'relative',
          zIndex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 22,
          }}
        >
          {topicTitle}&nbsp;·&nbsp;Code
        </div>

        <div
          style={{
            fontSize: 34,
            lineHeight: 1.35,
            fontWeight: 800,
            color: '#f7f9fc',
            marginBottom: 32,
            letterSpacing: -0.5,
            maxWidth: '92%',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            paddingBottom: 8,
          }}
        >
          {displayQuestion}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {code.map((block, i) => (
            <pre
              key={i}
              style={{
                fontFamily: MONO,
                fontSize: 30,
                lineHeight: 1.55,
                color: '#dbe5df',
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 16,
                padding: '28px 32px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflow: 'hidden',
              }}
            >
              {block}
            </pre>
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
