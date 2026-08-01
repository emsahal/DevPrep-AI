import type { CSSProperties, ReactNode } from 'react'
import logo from '@/assets/logo.png'

const SANS = "'Inter', system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', monospace"

const GRADIENT = 'linear-gradient(160deg, #050810 0%, #0a1f1a 50%, #0d2b21 100%)'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/---+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function highlightCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <span key={i} style={{ color: '#7fd88f' }}>
          {part.slice(1, -1)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

interface InstagramInterviewCardProps {
  topicTitle: string
  index: number
  total: number
  question: string
  answer: string
  style?: CSSProperties
}

export function InstagramInterviewCard({
  topicTitle,
  index,
  total,
  question,
  answer,
  style,
}: InstagramInterviewCardProps) {
  const number = pad(index + 1)
  const totalStr = pad(total)
  const cleanAnswer = stripMarkdown(answer)

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
          bottom: -100,
          right: -180,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(127,216,143,0.16), transparent 70%)',
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
            color: '#7fd88f',
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 26,
          }}
        >
          {topicTitle}&nbsp;·&nbsp;Interview Prep
        </div>

        <div
          style={{
            fontSize: 54,
            lineHeight: 1.26,
            fontWeight: 800,
            color: '#f7f9fc',
            marginBottom: 64,
            letterSpacing: -0.5,
            maxWidth: '92%',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {highlightCode(question)}
        </div>

        <div style={{ position: 'relative', paddingLeft: 44, borderLeft: '3px solid rgba(127,216,143,0.5)' }}>
          <div
            style={{
              position: 'absolute',
              left: -6,
              top: -46,
              fontSize: 130,
              fontWeight: 800,
              color: 'rgba(127,216,143,0.22)',
              fontFamily: 'Georgia, serif',
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontSize: 34,
              lineHeight: 1.55,
              color: '#e9edf5',
              fontWeight: 400,
              marginTop: 8,
              display: '-webkit-box',
              WebkitLineClamp: 9,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {cleanAnswer || 'See the full explanation on DevPrep.'}
          </p>
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
