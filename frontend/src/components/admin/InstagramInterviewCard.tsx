import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

function questionFontSize(text: string): number {
  const len = text.length
  if (len <= 60) return 52
  if (len <= 100) return 46
  if (len <= 140) return 40
  if (len <= 190) return 36
  return 32
}

function truncateQuestion(text: string, max = 210): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
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
  const displayQuestion = truncateQuestion(cleanQuestion(question))
  const hasAnswer = !!answer.trim()

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
          {topicTitle}&nbsp;·&nbsp;Interview Prep
        </div>

        <div
          style={{
            fontSize: questionFontSize(displayQuestion),
            lineHeight: 1.3,
            fontWeight: 800,
            color: '#f7f9fc',
            marginBottom: 30,
            letterSpacing: -0.5,
            maxWidth: '92%',
          }}
        >
          {displayQuestion}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            position: 'relative',
            paddingLeft: 22,
            borderLeft: '3px solid rgba(127,216,143,0.45)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -6,
              top: -18,
              fontSize: 110,
              fontWeight: 800,
              color: 'rgba(127,216,143,0.22)',
              fontFamily: 'Georgia, serif',
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>
          <div style={{ maxWidth: '100%', overflow: 'hidden', paddingTop: 40 }}>
            {hasAnswer ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) {
                    return (
                      <p style={{ margin: '0 0 12px', fontSize: 27, lineHeight: 1.5, color: '#e9edf5', fontWeight: 400 }}>
                        {children}
                      </p>
                    )
                  },
                  ul({ children }) {
                    return <ul style={{ margin: '0 0 12px', paddingLeft: 24, listStyleType: 'disc' }}>{children}</ul>
                  },
                  ol({ children }) {
                    return <ol style={{ margin: '0 0 12px', paddingLeft: 24, listStyleType: 'decimal' }}>{children}</ol>
                  },
                  li({ children }) {
                    return <li style={{ margin: '0 0 8px', fontSize: 26, lineHeight: 1.45, color: '#e9edf5' }}>{children}</li>
                  },
                  strong({ children }) {
                    return <strong style={{ color: ACCENT, fontWeight: 700 }}>{children}</strong>
                  },
                  code({ children }) {
                    return (
                      <code style={{ fontFamily: MONO, fontSize: '0.9em', color: 'inherit' }}>
                        {children}
                      </code>
                    )
                  },
                  blockquote({ children }) {
                    return (
                      <p
                        style={{
                          margin: '0 0 14px',
                          fontSize: 24,
                          fontStyle: 'italic',
                          color: 'rgba(255,255,255,0.55)',
                          borderLeft: '3px solid rgba(127,216,143,0.35)',
                          paddingLeft: 18,
                        }}
                      >
                        {children}
                      </p>
                    )
                  },
                  table({ children }) {
                    return (
                      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0 0 14px', tableLayout: 'fixed' }}>
                        {children}
                      </table>
                    )
                  },
                  thead({ children }) {
                    return <thead>{children}</thead>
                  },
                  tbody({ children }) {
                    return <tbody>{children}</tbody>
                  },
                  tr({ children }) {
                    return <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.14)' }}>{children}</tr>
                  },
                  th({ children }) {
                    return (
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: 22,
                          fontWeight: 800,
                          color: ACCENT,
                          background: 'rgba(127,216,143,0.12)',
                          borderBottom: '2px solid rgba(127,216,143,0.4)',
                        }}
                      >
                        {children}
                      </th>
                    )
                  },
                  td({ children }) {
                    return (
                      <td
                        style={{
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: 21,
                          lineHeight: 1.35,
                          color: '#e9edf5',
                          verticalAlign: 'top',
                        }}
                      >
                        {children}
                      </td>
                    )
                  },
                  h1({ children }) {
                    return <p style={{ margin: '0 0 12px', fontSize: 29, fontWeight: 800, color: '#f7f9fc' }}>{children}</p>
                  },
                  h2({ children }) {
                    return <p style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 800, color: '#f7f9fc' }}>{children}</p>
                  },
                  h3({ children }) {
                    return <p style={{ margin: '0 0 12px', fontSize: 27, fontWeight: 700, color: '#f7f9fc' }}>{children}</p>
                  },
                  a({ children }) {
                    return <span style={{ color: ACCENT }}>{children}</span>
                  },
                }}
              >
                {answer}
              </ReactMarkdown>
            ) : (
              <p style={{ margin: 0, fontSize: 27, lineHeight: 1.5, color: '#e9edf5' }}>
                See the full explanation on DevPrep.
              </p>
            )}
          </div>
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
