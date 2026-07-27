import type { QuizQuestion } from '@/services/quizService'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useMemo } from 'react'

interface QuizResultsCardProps {
  title: string
  topicName?: string
  questions: QuizQuestion[]
  selectedAnswers: Array<{ questionId: string; selectedAnswer: number }>
  score: number
  totalQuestions: number
  onRetry: () => void
  onRegenerate: () => void
  onDownload?: () => void
}

function toFileName(text: string, idx: number): string {
  const words = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean).slice(0, 4)
  return `q${String(idx + 1).padStart(2, '0')}-${words.join('-').toLowerCase() || 'question'}.spec.js`
}

const styles = {
  ink: '#0B1220',
  inkSoft: '#151F32',
  paper: '#F7F6F2',
  card: '#FFFFFF',
  line: '#E4E1D8',
  muted: '#57606A',
  pass: '#1A7F37',
  passBg: '#DAFBE1',
  passLine: '#B4E6BE',
  fail: '#CF222E',
  failBg: '#FFEBE9',
  failLine: '#F3C6C6',
}

export function QuizResultsCard({ title, topicName, questions, selectedAnswers, score, totalQuestions, onRetry, onRegenerate }: QuizResultsCardProps) {
  const selectedMap = useMemo(() => new Map(selectedAnswers.map((a) => [a.questionId, a.selectedAnswer])), [selectedAnswers])
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const passed = percentage >= 70

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: styles.ink, WebkitFontSmoothing: 'antialiased', background: styles.paper, borderRadius: 10, overflow: 'hidden', border: `1px solid ${styles.line}` }}>
      {/* ── Header ── */}
      <div style={{ background: styles.ink, color: '#EDEFF4', padding: '24px 28px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8B96AB', letterSpacing: '0.02em' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: styles.pass, boxShadow: `0 0 0 3px rgba(26,127,55,0.25)` }} />
          DEVPREP AI · MASTERY QUIZ
        </div>
        <h1 style={{ margin: '10px 0 4px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em', color: '#fff' }}>
          {title}
        </h1>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: '#9AA5B8' }}>
          <b style={{ color: '#D7DCE6', fontWeight: 600 }}>main</b> → results / {title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}.quiz · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* ── Score Card ── */}
      <div style={{ margin: '-1px 0 0', background: styles.card, borderBottom: `1px solid ${styles.line}`, padding: '20px 28px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700 }}>
            <span style={{ color: styles.pass }}>+{score} passed</span>
            <span style={{ color: styles.line, padding: '0 6px', fontWeight: 400 }}>/</span>
            <span style={{ color: styles.fail }}>−{totalQuestions - score} failed</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            padding: '4px 10px', borderRadius: 5, textTransform: 'uppercase',
            background: passed ? styles.passBg : styles.failBg,
            color: passed ? styles.pass : styles.fail,
            border: `1px solid ${passed ? styles.passLine : styles.failLine}`,
          }}>
            {passed ? 'Passed' : 'Failed'} · {percentage}%
          </div>
        </div>

        <div style={{ marginTop: 14, height: 8, borderRadius: 5, overflow: 'hidden', display: 'flex', background: styles.line }}>
          <div style={{ width: `${percentage}%`, background: styles.pass }} />
          <div style={{ width: `${100 - percentage}%`, background: styles.fail }} />
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 18, flexWrap: 'wrap', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: styles.muted }}>
          {topicName && <span>topic: <b style={{ color: styles.ink }}>{topicName}</b></span>}
          <span>questions: <b style={{ color: styles.ink }}>{totalQuestions}</b></span>
          <span>threshold to pass: <b style={{ color: styles.ink }}>70%</b></span>
          <span>result: <b style={{ color: passed ? styles.pass : styles.fail }}>{passed ? 'passed' : 'below threshold'}</b></span>
        </div>

        {/* Action icons */}
        <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: `1px solid ${styles.line}`, paddingTop: 12 }}>
          <button
            onClick={onRetry}
            title="Retry Quiz"
            style={{ background: 'none', border: `1px solid ${styles.line}`, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: styles.muted, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span style={{ fontSize: 14 }}>↻</span>
            Retry
          </button>
          <button
            onClick={onRegenerate}
            title="Regenerate Fresh Questions"
            style={{ background: 'none', border: `1px solid ${styles.line}`, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: styles.muted, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span style={{ fontSize: 14 }}>⟳</span>
            Regenerate
          </button>

        </div>
      </div>

      {/* ── Questions ── */}
      {questions.map((q, idx) => {
        const selectedAns = selectedMap.get(q.id)
        const fileName = toFileName(q.text, idx)

        return (
          <div key={q.id} style={{ margin: '16px 18px 0', border: `1px solid ${styles.line}`, borderRadius: 8, overflow: 'hidden', background: styles.card, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            {/* File header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F1EFE9', borderBottom: `1px solid ${styles.line}`, padding: '7px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: styles.muted }}>
              <span style={{ fontWeight: 700, color: '#8B96AB', fontSize: 10 }}>Q{String(idx + 1).padStart(2, '0')}</span>
              <span style={{ color: styles.ink, fontWeight: 600 }}>{fileName}</span>
            </div>

            {/* Question text */}
            <div style={{ padding: '14px 18px 2px', fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: styles.ink }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) { return <p style={{ margin: 0 }}>{children}</p> },
                  code({ className, children, ...props }) {
                    const isInline = !className
                    if (isInline) return <code style={{ fontFamily: "'JetBrains Mono', monospace", background: styles.paper, padding: '1px 5px', borderRadius: 4, fontSize: 12.5 }} {...props}>{children}</code>
                    return <pre style={{ fontFamily: "'JetBrains Mono', monospace", background: styles.paper, padding: 10, borderRadius: 6, fontSize: 12, overflow: 'auto', margin: '6px 0' }}><code className={className} {...props}>{children}</code></pre>
                  },
                }}
              >
                {q.text.replace(/\\n/g, '\n')}
              </ReactMarkdown>
            </div>

            {/* Options */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, padding: '4px 0 2px' }}>
              {q.options.map((opt, i) => {
                const isSelected = i === selectedAns
                const isOptCorrect = i === q.correctAnswer
                const lineBg = isSelected && isOptCorrect ? styles.passBg
                  : isSelected && !isOptCorrect ? styles.failBg
                  : !isSelected && isOptCorrect && selectedAns !== undefined ? styles.passBg
                  : 'transparent'
                const lineBorder = isSelected && isOptCorrect ? styles.pass
                  : isSelected && !isOptCorrect ? styles.fail
                  : !isSelected && isOptCorrect && selectedAns !== undefined ? styles.pass
                  : 'transparent'
                const labelColor = isSelected && isOptCorrect ? styles.pass
                  : isSelected && !isOptCorrect ? styles.fail
                  : !isSelected && isOptCorrect && selectedAns !== undefined ? styles.pass
                  : '#B7BEC9'
                const prefix = isSelected && isOptCorrect ? '+'
                  : isSelected && !isOptCorrect ? '−'
                  : '·'

                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', padding: '4px 18px', lineHeight: 1.55,
                    borderLeft: `3px solid ${lineBorder}`, background: lineBg,
                  }}>
                    <span style={{ width: 16, flex: '0 0 16px', textAlign: 'center', fontWeight: 700, color: labelColor }}>{prefix}</span>
                    <span style={{ width: 16, flex: '0 0 16px', color: labelColor, fontWeight: 600 }}>{String.fromCharCode(65 + i)}</span>
                    <span style={{ color: (isSelected || (isOptCorrect && selectedAns !== undefined)) ? styles.ink : '#3B4453', fontWeight: isSelected || (isOptCorrect && selectedAns !== undefined) ? 500 : 400 }}>
                      {opt}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* AI Explanation */}
            {q.explanation && (
              <div style={{ margin: '10px 14px 14px', border: `1px solid ${styles.line}`, borderRadius: 7, background: '#FAFAF7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderBottom: `1px solid ${styles.line}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: styles.muted }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: styles.ink, color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    DP
                  </span>
                  DevPrep AI commented
                </div>
                <div style={{ padding: '10px 14px 12px', fontSize: 13, lineHeight: 1.6, color: '#3B4453' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p({ children }) { return <p style={{ margin: '0 0 4px' }}>{children}</p> },
                      strong({ children }) { return <strong style={{ fontWeight: 600, color: styles.ink }}>{children}</strong> },
                      code({ className, children, ...props }) {
                        const isInline = !className
                        if (isInline) return <code style={{ fontFamily: "'JetBrains Mono', monospace", background: styles.paper, padding: '1px 4px', borderRadius: 3, fontSize: 12 }} {...props}>{children}</code>
                        return <pre style={{ fontFamily: "'JetBrains Mono', monospace", background: styles.paper, padding: 8, borderRadius: 4, fontSize: 11.5, overflow: 'auto', margin: '4px 0' }}><code className={className} {...props}>{children}</code></pre>
                      },
                    }}
                  >
                    {q.explanation.replace(/\\n/g, '\n')}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* ── Footer ── */}
      <div style={{ margin: '24px 18px 18px', display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: '#9AA5B8', paddingTop: 12, borderTop: `1px solid ${styles.line}` }}>
        <span>devprep-ai / {title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}</span>
        <span>generated by DevPrep AI</span>
      </div>
    </div>
  )
}
