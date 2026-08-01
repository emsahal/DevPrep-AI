import type { CSSProperties } from 'react'

const GRADIENT = 'linear-gradient(135deg, #064e3b 0%, #065f46 55%, #0f766e 100%)'

interface InstagramInterviewCardProps {
  topicTitle: string
  index: number
  total: number
  question: string
  answer: string
  style?: CSSProperties
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

export function InstagramInterviewCard({
  topicTitle,
  index,
  total,
  question,
  answer,
  style,
}: InstagramInterviewCardProps) {
  const cleanQuestion = stripMarkdown(question)
  const cleanAnswer = stripMarkdown(answer)

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#2dd4bf',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: '#064e3b',
            }}
          >
            I
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>Interview Prep</span>
        </div>
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#2dd4bf',
            background: 'rgba(45,212,191,0.15)',
            padding: '12px 24px',
            borderRadius: 999,
          }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div style={{ padding: '24px 60px 0', fontSize: 24, fontWeight: 500, color: '#99f6e4' }}>
        {topicTitle}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 60px', minHeight: 0 }}>
        <div
          style={{
            fontSize: 44,
            lineHeight: 1.3,
            fontWeight: 800,
            color: '#ffffff',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {cleanQuestion}
        </div>

        <div
          style={{
            marginTop: 28,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 22,
            padding: '26px 30px',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#5eead4', marginBottom: 12, letterSpacing: 1 }}>
            ✓ ANSWER
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              fontWeight: 500,
              color: '#f0fdfa',
              display: '-webkit-box',
              WebkitLineClamp: 8,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {cleanAnswer || 'See the full explanation on DevPrep.'}
          </div>
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
        <span style={{ fontSize: 24, fontWeight: 600, color: '#5eead4' }}>@devprep.ai</span>
        <span style={{ fontSize: 24, fontWeight: 500, color: '#99f6e4' }}>Question {index + 1}</span>
      </div>
    </div>
  )
}
