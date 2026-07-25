import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { interviewPrepService } from '@/services/interviewPrepService'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useState, useRef, useEffect } from 'react'

function getLanguageContent(content: string, language: 'roman' | 'english') {
  const romanMarker = '<!--LANG:roman-->'
  const englishMarker = '<!--LANG:english-->'
  const romanStart = content.indexOf(romanMarker)
  const englishStart = content.indexOf(englishMarker)

  if (romanStart === -1 || englishStart === -1) return content

  if (language === 'english') {
    return content.slice(englishStart + englishMarker.length).trim()
  }
  return content.slice(romanStart + romanMarker.length, englishStart).trim()
}

function CollapsibleContent({ show, children }: { show: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [show, children])

  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-in-out"
      style={{
        maxHeight: show ? height : 0,
        opacity: show ? 1 : 0,
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  index,
  isOpen,
  expandedAll,
  onToggle,
}: {
  question: string
  index: number
  isOpen: boolean
  expandedAll: boolean
  onToggle: (idx: number) => void
}) {
  const lines = question.trim().split('\n')
  const questionText = lines[0].replace(/^\*\*/, '').replace(/\*\*$/, '').trim()
  const answerContent = lines.slice(1).join('\n').trim()
  const show = expandedAll || isOpen

  return (
    <div
      className="bento-card overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        border: show ? '1px solid var(--color-primary)' : '1px solid var(--color-border-muted)',
        background: show ? 'var(--color-surface)' : 'var(--color-surface-container)',
        boxShadow: show ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between p-5 text-left group"
        style={{ color: 'var(--color-on-surface)' }}
      >
        <span className="font-bold text-base flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300"
                style={{
                  background: show ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                  color: show ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                }}>
            {index + 1}
          </span>
          <span className="transition-colors duration-300" style={{ color: show ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}>
            {questionText}
          </span>
        </span>
        <span className={`material-symbols-outlined transition-all duration-500 ${show ? 'rotate-180' : ''}`}
              style={{ color: 'var(--color-outline)', fontSize: '24px' }}>
          expand_more
        </span>
      </button>

      <CollapsibleContent show={show}>
        <div className="px-5 pb-5 pt-0 border-t" style={{ borderColor: 'var(--color-border-muted)' }}>
          <div className="max-w-none mt-4 space-y-2"
               style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.7' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = !className
                  if (isInline) {
                    return <code className="px-1.5 py-0.5 rounded text-sm font-code"
                      style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-primary)', fontSize: '14px' }} {...props}>{children}</code>
                  }
                  return (
                    <div className="rounded-xl overflow-hidden my-4" style={{ border: '1px solid var(--color-border-muted)' }}>
                      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'var(--color-surface-container-high)', borderBottom: '1px solid var(--color-border-muted)' }}>
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>{className?.replace('language-', '') || 'code'}</span>
                        <button onClick={e => {
                          navigator.clipboard.writeText(String(children))
                          const btn = e.currentTarget
                          btn.textContent = 'Copied!'
                          setTimeout(() => { btn.textContent = 'content_copy' }, 1500)
                        }}
                          className="material-symbols-outlined text-[18px] ml-auto" style={{ color: 'var(--color-outline)' }}>content_copy</button>
                      </div>
                      <pre className="p-4 m-0 overflow-x-auto font-code" style={{ background: 'var(--color-surface)', fontSize: '14px', lineHeight: '1.6' }}>
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  )
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4 rounded-xl" style={{ border: '1px solid var(--color-border-muted)' }}>
                      <table className="w-full text-sm" style={{ fontSize: '14px', borderCollapse: 'collapse' }}>
                        {children}
                      </table>
                    </div>
                  )
                },
                thead({ children }) {
                  return <thead style={{ background: 'var(--color-surface-container-high)' }}>{children}</thead>
                },
                tbody({ children }) {
                  return <tbody>{children}</tbody>
                },
                tr({ children, style }) {
                  return <tr style={{ borderBottom: '1px solid var(--color-border-muted)', ...style }}>{children}</tr>
                },
                th({ children, style }) {
                  return <th className="text-left font-bold px-4 py-3" style={{ color: 'var(--color-on-surface)', ...style }}>{children}</th>
                },
                td({ children, style }) {
                  return <td className="px-4 py-3" style={{ color: 'var(--color-on-surface-variant)', ...style }}>{children}</td>
                },
                h2({ children }) {
                  const text = String(children)
                  const isCoding = text.includes('Coding Challenges')
                  return (
                    <div className={`flex items-center gap-2 mb-3 mt-5 ${isCoding ? 'pt-4 border-t' : ''}`}
                         style={isCoding ? { borderColor: 'var(--color-primary)', marginTop: '32px' } : {}}>
                      {isCoding && (
                        <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-primary)' }}>code</span>
                      )}
                      <h2 className="text-lg font-bold" style={{ color: isCoding ? 'var(--color-primary)' : 'var(--color-on-surface)' }}>
                        {children}
                      </h2>
                    </div>
                  )
                },
                h3({ children }) {
                  return <h3 className="font-bold mb-2 mt-4" style={{ color: 'var(--color-on-surface)', fontSize: '16px' }}>{children}</h3>
                },
                p({ children, ...props }) {
                  let text = ''
                  try { text = typeof children === 'string' ? children : ''; if (Array.isArray(children)) text = children.map(c => typeof c === 'string' ? c : '').join('') } catch {}
                  if (text.startsWith('💡')) {
                    return (
                      <div className="flex items-start gap-2 px-4 py-3 rounded-xl my-3" style={{ background: 'var(--color-primary-fixed-dim)', border: '1px solid var(--color-primary)' }}>
                        <span style={{ color: 'var(--color-primary)', fontSize: '18px', flexShrink: 0 }}>💡</span>
                        <p style={{ color: 'var(--color-on-surface)', fontSize: '15px', lineHeight: '1.6', margin: 0 }} {...props}>{children}</p>
                      </div>
                    )
                  }
                  return <p className="mb-3" style={{ color: 'var(--color-on-surface-variant)', fontSize: '16px', lineHeight: '1.7' }} {...props}>{children}</p>
                },
                strong({ children }) {
                  return <strong style={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>{children}</strong>
                },
                hr() {
                  return <hr className="my-6" style={{ borderColor: 'var(--color-border-muted)', borderStyle: 'dashed' }} />
                },
                ul({ children }) {
                  return <ul className="mb-3 space-y-1.5" style={{ color: 'var(--color-on-surface-variant)', fontSize: '16px', lineHeight: '1.7' }}>{children}</ul>
                },
                ol({ children }) {
                  return <ol className="mb-3 space-y-1.5" style={{ color: 'var(--color-on-surface-variant)', fontSize: '16px', lineHeight: '1.7' }}>{children}</ol>
                },
                li({ children }) {
                  return <li className="leading-relaxed" style={{ paddingLeft: '4px' }}>{children}</li>
                },
              }}
            >
              {answerContent}
            </ReactMarkdown>
          </div>
        </div>
      </CollapsibleContent>
    </div>
  )
}

export function InterviewPrepTopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set())
  const [expandedAll, setExpandedAll] = useState(false)
  const [contentLanguage, setContentLanguage] = useState<'roman' | 'english'>('roman')

  const toggleQuestion = (idx: number) => {
    setOpenQuestions(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['interview-prep', slug],
    queryFn: () => interviewPrepService.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto text-center py-20">
        <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>error</span>
        <p style={{ color: 'var(--color-outline)' }}>Topic not found</p>
        <Link to="/interview-prep" className="text-sm mt-4 inline-block" style={{ color: 'var(--color-primary)' }}>Back to topics</Link>
      </div>
    )
  }

  const langOptions = [
    { label: 'Roman Urdu', value: 'roman', icon: 'translate' },
    { label: 'English', value: 'english', icon: 'text_fields' },
  ] as const

  const displayContent = getLanguageContent(topic.content, contentLanguage)
  const questions = displayContent.split(/^## \d+\./m).slice(1)

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6 animate-fade-up">
        <Link to="/interview-prep" className="text-xs flex items-center gap-1 mb-3"
              style={{ color: 'var(--color-primary)' }}>
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          Back to topics
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
          {topic.name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          {topic.questionCount} questions with code examples
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 animate-fade-up animation-delay-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-on-surface-variant)' }}>translate</span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Language:</span>
          {langOptions.map(opt => (
            <button key={opt.value}
              onClick={() => setContentLanguage(opt.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
              style={{
                background: contentLanguage === opt.value ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                color: contentLanguage === opt.value ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
              }}>
              <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
        <button onClick={() => setExpandedAll(!expandedAll)}
                className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: expandedAll ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                  color: expandedAll ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                }}>
          {expandedAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="flex flex-col gap-4 animate-fade-up animation-delay-200">
        {questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            question={q}
            index={idx}
            isOpen={openQuestions.has(idx)}
            expandedAll={expandedAll}
            onToggle={toggleQuestion}
          />
        ))}
      </div>
    </div>
  )
}
