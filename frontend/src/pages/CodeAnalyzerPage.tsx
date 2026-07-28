import { useState, useMemo, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { allQuestions, LEVELS } from '@/data/dsa-questions'
import type { DSAQuestion } from '@/data/dsa-questions'
import { dsaCheckService } from '@/services/dsaCheckService'

type Panel = 'intuition' | 'pseudocode' | 'dry-run' | 'tips'

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Easy: { bg: '#16A34A22', text: '#4ADE80' },
  Medium: { bg: '#EA580C22', text: '#FB923C' },
  Hard: { bg: '#DC262622', text: '#F87171' },
}

export function CodeAnalyzerPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<'cpp' | 'javascript'>('cpp')
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set())
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]))

  const question = useMemo(() => {
    if (!selectedId) return null
    return allQuestions.find(q => q.id === selectedId) ?? null
  }, [selectedId])

  const checkMutation = useMutation({
    mutationFn: (params: { questionTitle: string; questionProblem: string; questionExamples: { input: string; output: string }[]; code: string }) =>
      dsaCheckService.check(params),
  })

  const handleSelectQuestion = useCallback((id: string) => {
    setSelectedId(id)
    setCode('')
    checkMutation.reset()
    setOpenPanels(new Set())
    const q = allQuestions.find(x => x.id === id)
    if (q) {
      setCode(q.starterCode.cpp)
    }
  }, [])

  const togglePanel = (panel: Panel) => {
    setOpenPanels(prev => {
      const next = new Set(prev)
      if (next.has(panel)) next.delete(panel)
      else next.add(panel)
      return next
    })
  }

  const handleSubmit = () => {
    if (!question || !code.trim()) return
    checkMutation.mutate({
      questionTitle: question.title,
      questionProblem: question.problem,
      questionExamples: question.examples,
      code,
    })
  }

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => {
      const next = new Set(prev)
      if (next.has(level)) next.delete(level)
      else next.add(level)
      return next
    })
  }

  const result = checkMutation.data

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Question Browser */}
        <div style={{
          width: 280, flexShrink: 0, overflow: 'auto',
          borderRight: '1px solid var(--color-border-muted)',
          background: 'var(--color-surface-container-low)',
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-on-surface)' }}>DSA Practice</div>
            <div style={{ fontSize: 11, color: 'var(--color-outline)', marginTop: 2 }}>{allQuestions.length} questions</div>
          </div>
          {LEVELS.map(level => {
            const isOpen = expandedLevels.has(level.level)
            const levelQuestions = allQuestions.filter(q => q.level === level.level)
            return (
              <div key={level.level}>
                <div
                  onClick={() => toggleLevel(level.level)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    color: 'var(--color-on-surface)', borderBottom: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-surface-container)',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ fontSize: 10, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▶</span>
                  <span>Level {level.level}</span>
                  <span style={{ marginLeft: 4, color: 'var(--color-outline)', fontWeight: 400 }}>
                    ({levelQuestions.length})
                  </span>
                </div>
                {isOpen && (
                  <div>
                    {level.topics.map(topic => {
                      const topicQuestions = levelQuestions.filter(q => q.id === topic.questionIds.find(id => levelQuestions.some(lq => lq.id === id)))
                      return (
                        <div key={topic.name}>
                          <div style={{
                            padding: '4px 14px 4px 28px', fontSize: 11, fontWeight: 600,
                            color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}>
                            {topic.name}
                          </div>
                          {topic.questionIds.map(id => {
                            const q = allQuestions.find(x => x.id === id)
                            if (!q) return null
                            const isSelected = selectedId === q.id
                            const dc = difficultyColors[q.difficulty]
                            return (
                              <div
                                key={q.id}
                                onClick={() => handleSelectQuestion(q.id)}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '5px 14px 5px 38px', cursor: 'pointer', fontSize: 12.5,
                                  color: isSelected ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                                  background: isSelected ? 'var(--color-primary-container, rgba(139,92,246,0.08))' : 'transparent',
                                  borderLeft: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent',
                                }}
                              >
                                <span>{q.title}</span>
                                <span style={{ fontSize: 10, fontWeight: 600, color: dc.text, background: dc.bg, padding: '1px 6px', borderRadius: 8 }}>
                                  {q.difficulty === 'Easy' ? 'E' : q.difficulty === 'Medium' ? 'M' : 'H'}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Main Content - Problem + Code Editor */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--color-surface-container-lowest)' }}>
          {!question ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-outline)', fontSize: 15 }}>
              Select a question from the sidebar to start practicing
            </div>
          ) : (
            <>
              {/* Problem Description */}
              <div style={{ flex: '0 0 auto', overflow: 'auto', borderBottom: '1px solid var(--color-border-subtle)', maxHeight: '45%' }}>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-on-surface)', margin: 0 }}>{question.title}</h2>
                    {(() => { const dc = difficultyColors[question.difficulty]; return (
                      <span style={{ fontSize: 11, fontWeight: 600, color: dc.text, background: dc.bg, padding: '2px 10px', borderRadius: 10 }}>{question.difficulty}</span>
                    )})()}
                    <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>{question.topic}</span>
                  </div>

                  <p style={{ fontSize: 13.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7, margin: '0 0 12px' }}>{question.problem}</p>

                  {/* Examples */}
                  <div style={{ marginBottom: 12 }}>
                    {question.examples.map((ex, i) => (
                      <div key={i} style={{ marginBottom: 8, fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--color-on-surface)' }}>Example {i + 1}:</strong>
                        <div style={{ background: 'var(--color-surface-container)', borderRadius: 6, padding: '8px 12px', marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          <div><span style={{ color: 'var(--color-outline)' }}>Input: </span>{ex.input}</div>
                          <div><span style={{ color: 'var(--color-outline)' }}>Output: </span>{ex.output}</div>
                          {ex.explanation && <div><span style={{ color: 'var(--color-outline)' }}>Explanation: </span>{ex.explanation}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div style={{ marginBottom: 12 }}>
                    <strong style={{ fontSize: 12, color: 'var(--color-on-surface)' }}>Constraints:</strong>
                    <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.8 }}>
                      {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>

                  {/* Collapsible Help Panels */}
                  {([
                    { key: 'intuition' as Panel, label: 'Intuition & Approach', content: question.intuition, type: 'text' },
                    { key: 'pseudocode' as Panel, label: 'Pseudocode', content: question.pseudocode, type: 'list' },
                    { key: 'dry-run' as Panel, label: 'Dry Run / Walkthrough', content: question.dryRun, type: 'dryrun' },
                    { key: 'tips' as Panel, label: 'Tips & Hints', content: question.tips, type: 'list' },
                  ] as const).map(({ key, label, content, type }) => {
                    const isOpen = openPanels.has(key)
                    return (
                      <div key={key} style={{ marginBottom: 6, border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                        <div
                          onClick={() => togglePanel(key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', cursor: 'pointer',
                            fontSize: 12.5, fontWeight: 600, color: 'var(--color-on-surface)',
                            background: 'var(--color-surface-container)',
                            userSelect: 'none',
                          }}
                        >
                          <span style={{ fontSize: 10, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▶</span>
                          {label}
                        </div>
                        {isOpen && (
                          <div style={{ padding: '8px 12px', fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                            {type === 'text' && <p style={{ margin: 0 }}>{content as string}</p>}
                            {type === 'list' && (
                              <ul style={{ margin: 0, paddingLeft: 16 }}>
                                {(content as string[]).map((item, i) => <li key={i}>{item}</li>)}
                              </ul>
                            )}
                            {type === 'dryrun' && (() => {
                              const dr = content as { text: string; steps: { title: string; content: string }[] }
                              return (
                                <div>
                                  <p style={{ margin: '0 0 8px' }}>{dr.text}</p>
                                  {dr.steps.map((step, i) => (
                                    <div key={i} style={{ marginBottom: 6, padding: '6px 10px', background: 'var(--color-surface-container)', borderRadius: 6 }}>
                                      <strong style={{ color: 'var(--color-primary)', fontSize: 12 }}>Step {i + 1}: {step.title}</strong>
                                      <p style={{ margin: '2px 0 0', fontSize: 12 }}>{step.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Code Editor */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-low)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>code</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-on-surface)' }}>Your Solution</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                      value={language}
                      onChange={e => {
                        setLanguage(e.target.value as 'cpp' | 'javascript')
                        if (question) setCode(question.starterCode[e.target.value as 'cpp' | 'javascript'])
                      }}
                      style={{
                        fontSize: 11, padding: '3px 8px', borderRadius: 4,
                        border: '1px solid var(--color-border-muted)',
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="cpp">C++</option>
                      <option value="javascript">JavaScript</option>
                    </select>
                    <button
                      onClick={handleSubmit}
                      disabled={checkMutation.isPending || !code.trim()}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 14px', borderRadius: 6,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        border: 'none',
                        background: 'var(--color-primary)',
                        color: '#FFFFFF',
                        opacity: checkMutation.isPending || !code.trim() ? 0.6 : 1,
                      }}
                    >
                      {checkMutation.isPending ? (
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                      )}
                      {checkMutation.isPending ? 'Checking...' : 'Check Solution'}
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}>
                  <div style={{ padding: '10px 8px', textAlign: 'right', minWidth: 36, color: 'var(--color-border-muted)', background: 'var(--color-surface-container-low)', borderRight: '1px solid var(--color-border-subtle)', userSelect: 'none' }}>
                    {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px', border: 'none', outline: 'none', resize: 'none',
                      background: 'transparent', color: 'var(--color-on-surface)',
                      fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit',
                      whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'auto',
                    }}
                    spellCheck={false}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - AI Evaluation */}
        <div style={{
          width: 350, flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderLeft: '1px solid var(--color-border-muted)',
          background: 'var(--color-surface-container-lowest)',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-on-surface)' }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-primary)' }}>rate_review</span>
              AI Evaluation
            </h3>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            {checkMutation.isPending ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--color-outline)' }}>
                <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
                <span style={{ fontSize: 13 }}>Evaluating your solution...</span>
              </div>
            ) : checkMutation.error ? (
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', fontSize: 13, color: 'var(--color-error)' }}>
                Failed to evaluate. Please try again.
              </div>
            ) : result ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 700,
                    background: result.score >= 80 ? 'rgba(34,197,94,0.15)' : result.score >= 50 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                    color: result.score >= 80 ? '#4ADE80' : result.score >= 50 ? '#EAB308' : '#F87171',
                  }}>
                    {result.score}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-on-surface)' }}>
                      {result.isCorrect ? '✅ Correct' : '❌ Needs Improvement'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-outline)' }}>Score out of 100</div>
                  </div>
                </div>

                {/* Complexity */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#60A5FA', fontWeight: 600 }}>Time: {result.timeComplexity}</span>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', color: '#A78BFA', fontWeight: 600 }}>Space: {result.spaceComplexity}</span>
                </div>

                {/* Feedback */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: 4 }}>Feedback</div>
                  <p style={{ fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{result.feedback}</p>
                </div>

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#F87171', marginBottom: 4 }}>Issues</div>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                      {result.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#4ADE80', marginBottom: 4 }}>Suggestions</div>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                      {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}

                {/* Expected Approach */}
                <div style={{ padding: 10, borderRadius: 8, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 2 }}>Expected Approach</div>
                  <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{result.expectedApproach}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--color-outline)', textAlign: 'center' }}>
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>rate_review</span>
                <p style={{ fontSize: 13, margin: 0 }}>Write your solution and click<br/><strong>"Check Solution"</strong> to get AI feedback.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}