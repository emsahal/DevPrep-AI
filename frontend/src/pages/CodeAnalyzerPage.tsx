import { useState, useMemo, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { allQuestions, LEVELS } from '@/data/dsa-questions'
import { dsaCheckService } from '@/services/dsaCheckService'

type View = 'levels' | 'questions' | 'solve'

const levelColors = [
  { bg: 'linear-gradient(135deg, #1a1a3e, #2d1b69)', border: '#4a3a8a', accent: '#8B5CF6' },
  { bg: 'linear-gradient(135deg, #0f2d1a, #1a4a2e)', border: '#2a6a3e', accent: '#4ADE80' },
  { bg: 'linear-gradient(135deg, #2d1a0f, #4a2e1a)', border: '#7a4a2a', accent: '#FB923C' },
  { bg: 'linear-gradient(135deg, #0f1a2d, #1a2e4a)', border: '#2a4a7a', accent: '#60A5FA' },
  { bg: 'linear-gradient(135deg, #1a0f2d, #2e1a4a)', border: '#4a2a7a', accent: '#A78BFA' },
]

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Easy: { bg: '#16A34A22', text: '#4ADE80' },
  Medium: { bg: '#EA580C22', text: '#FB923C' },
  Hard: { bg: '#DC262622', text: '#F87171' },
}

const levelRatings = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']

const levelNames: Record<number, string> = {
  1: 'Must Know',
  2: 'Very Common',
  3: 'Most Asked DSA',
  4: 'Trees',
  5: 'Dynamic Programming',
}

export function CodeAnalyzerPage() {
  const [view, setView] = useState<View>('levels')
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<'cpp' | 'javascript'>('cpp')
  const [showEditor, setShowEditor] = useState(false)

  const question = useMemo(() => {
    if (!selectedId) return null
    return allQuestions.find(q => q.id === selectedId) ?? null
  }, [selectedId])

  const checkMutation = useMutation({
    mutationFn: (params: { questionTitle: string; questionProblem: string; questionExamples: { input: string; output: string }[]; code: string }) =>
      dsaCheckService.check(params),
  })

  const handleSelectLevel = useCallback((level: number) => {
    setSelectedLevel(level)
    setView('questions')
    setSelectedId(null)
    setShowEditor(false)
    checkMutation.reset()
  }, [])

  const handleSelectQuestion = useCallback((id: string) => {
    setSelectedId(id)
    setView('solve')
    setShowEditor(false)
    checkMutation.reset()
    setCode('')
    const q = allQuestions.find(x => x.id === id)
    if (q) setCode(q.starterCode.cpp)
  }, [])

  const handleBackToLevels = useCallback(() => {
    setView('levels')
    setSelectedLevel(null)
    setSelectedId(null)
    setShowEditor(false)
    checkMutation.reset()
  }, [])

  const handleBackToQuestions = useCallback(() => {
    setView('questions')
    setSelectedId(null)
    setShowEditor(false)
    checkMutation.reset()
  }, [])

  const handleSolveNow = useCallback(() => {
    setShowEditor(true)
  }, [])

  const handleSubmit = () => {
    if (!question || !code.trim()) return
    checkMutation.mutate({
      questionTitle: question.title,
      questionProblem: question.problem,
      questionExamples: question.examples,
      code,
    })
  }

  const result = checkMutation.data

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--color-surface-container-lowest)', overflow: 'auto' }}>

          {/* ========== LEVELS VIEW ========== */}
          {view === 'levels' && (
            <div style={{ padding: 32, maxWidth: 900, margin: '0 auto', width: '100%' }}>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-on-surface)', margin: 0 }}>DSA Practice</h1>
                <p style={{ fontSize: 14, color: 'var(--color-outline)', margin: '6px 0 0' }}>Choose a level to start practicing. {allQuestions.length} questions total.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {LEVELS.map((level, i) => {
                  const levelQ = allQuestions.filter(q => q.level === level.level)
                  const colors = levelColors[i]
                  return (
                    <div
                      key={level.level}
                      onClick={() => handleSelectLevel(level.level)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 20,
                        padding: '18px 24px', borderRadius: 14, cursor: 'pointer',
                        background: colors.bg, border: `1px solid ${colors.border}`,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.1)', fontSize: 22, fontWeight: 700, color: colors.accent, flexShrink: 0,
                      }}>
                        {level.level}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#FFF', marginBottom: 2 }}>Level {level.level}: {level.name}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                          {level.topics.map(t => t.name).join(' • ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 22 }}>{levelRatings[level.rating - 1] || '⭐⭐⭐⭐⭐'}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{levelQ.length} questions</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========== QUESTIONS VIEW ========== */}
          {view === 'questions' && selectedLevel && (
            <div style={{ padding: 32, maxWidth: 900, margin: '0 auto', width: '100%' }}>
              <button onClick={handleBackToLevels} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16 }}>
                ← Back to Levels
              </button>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-on-surface)', margin: '0 0 4px' }}>
                Level {selectedLevel}: {levelNames[selectedLevel]}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-outline)', margin: '0 0 20px' }}>
                {(() => { const l = LEVELS.find(lv => lv.level === selectedLevel); return l ? l.topics.map(t => t.name).join(' • ') : '' })()}
              </p>
              {(() => {
                const levelDef = LEVELS.find(lv => lv.level === selectedLevel)
                if (!levelDef) return null
                return levelDef.topics.map(topic => {
                  const topicQs = topic.questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean)
                  if (topicQs.length === 0) return null
                  return (
                    <div key={topic.name} style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 8px' }}>{topic.name}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {topicQs.map(q => {
                          if (!q) return null
                          const dc = difficultyColors[q.difficulty]
                          return (
                            <div
                              key={q.id}
                              onClick={() => handleSelectQuestion(q.id)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                                background: 'var(--color-surface-container)',
                                border: '1px solid var(--color-border-subtle)',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-container-high, rgba(255,255,255,0.05))' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-container)' }}
                            >
                              <span style={{ fontSize: 13.5, color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>{q.title}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: dc.text, background: dc.bg, padding: '2px 10px', borderRadius: 8 }}>
                                {q.difficulty}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          )}

          {/* ========== SOLVE VIEW ========== */}
          {view === 'solve' && question && (
            <div style={{ padding: 32, maxWidth: 900, margin: '0 auto', width: '100%' }}>
              <button onClick={handleBackToQuestions} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16 }}>
                ← Back to Questions
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-on-surface)', margin: 0 }}>{question.title}</h2>
                {(() => { const dc = difficultyColors[question.difficulty]; return (
                  <span style={{ fontSize: 11, fontWeight: 600, color: dc.text, background: dc.bg, padding: '2px 10px', borderRadius: 10 }}>{question.difficulty}</span>
                )})()}
                <span style={{ fontSize: 12, color: 'var(--color-outline)' }}>{question.topic} · Level {question.level}</span>
              </div>

              {/* Problem Description */}
              <p style={{ fontSize: 13.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7, margin: '0 0 14px' }}>{question.problem}</p>

              {/* Examples */}
              <div style={{ marginBottom: 14 }}>
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
              <div style={{ marginBottom: 14 }}>
                <strong style={{ fontSize: 12, color: 'var(--color-on-surface)' }}>Constraints:</strong>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.8 }}>
                  {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>

              {/* Learning Panels - always expanded */}
              <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--color-on-surface)', background: 'var(--color-surface-container)' }}>
                    💡 Intuition & Approach
                  </div>
                  <div style={{ padding: '10px 14px', fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                    {question.intuition}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--color-on-surface)', background: 'var(--color-surface-container)' }}>
                    📝 Pseudocode
                  </div>
                  <div style={{ padding: '10px 14px', fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {question.pseudocode.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--color-on-surface)', background: 'var(--color-surface-container)' }}>
                    🔄 Dry Run / Walkthrough
                  </div>
                  <div style={{ padding: '10px 14px', fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                    <p style={{ margin: '0 0 8px' }}>{question.dryRun.text}</p>
                    {question.dryRun.steps.map((step, i) => (
                      <div key={i} style={{ marginBottom: 6, padding: '6px 10px', background: 'var(--color-surface-container)', borderRadius: 6 }}>
                        <strong style={{ color: 'var(--color-primary)', fontSize: 12 }}>Step {i + 1}: {step.title}</strong>
                        <p style={{ margin: '2px 0 0', fontSize: 12 }}>{step.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--color-on-surface)', background: 'var(--color-surface-container)' }}>
                    🎯 Tips & Hints
                  </div>
                  <div style={{ padding: '10px 14px', fontSize: 12.5, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {question.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Complexity Badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#60A5FA', fontWeight: 600 }}>
                  Time: {question.complexity.time}
                </span>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', color: '#A78BFA', fontWeight: 600 }}>
                  Space: {question.complexity.space}
                </span>
              </div>

              {/* Solve Now Button */}
              {!showEditor && (
                <button
                  onClick={handleSolveNow}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px', borderRadius: 10,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    border: 'none', background: 'var(--color-primary)', color: '#FFF',
                    marginBottom: 16,
                  }}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                  Solve Now — Write Your Solution
                </button>
              )}

              {/* Code Editor */}
              {showEditor && (
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-low)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  <div style={{ display: 'flex', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6, minHeight: 250 }}>
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
              )}

              {/* AI Evaluation Results */}
              {checkMutation.isPending && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderRadius: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', marginBottom: 16 }}>
                  <span className="material-symbols-outlined animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
                  <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>Evaluating your solution...</span>
                </div>
              )}
              {checkMutation.error && (
                <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', fontSize: 13, color: 'var(--color-error)', marginBottom: 16 }}>
                  Failed to evaluate. Please try again.
                </div>
              )}
              {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 10, border: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container)', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 700,
                      background: result.score >= 80 ? 'rgba(34,197,94,0.15)' : result.score >= 50 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                      color: result.score >= 80 ? '#4ADE80' : result.score >= 50 ? '#EAB308' : '#F87171',
                    }}>
                      {result.score}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-on-surface)' }}>
                        {result.isCorrect ? '✅ Correct Solution' : '❌ Needs Improvement'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-outline)' }}>AI Evaluation Score</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#60A5FA', fontWeight: 600 }}>Time: {result.timeComplexity}</span>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', color: '#A78BFA', fontWeight: 600 }}>Space: {result.spaceComplexity}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: 4 }}>Feedback</div>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{result.feedback}</p>
                  </div>
                  {result.issues.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#F87171', marginBottom: 4 }}>Issues</div>
                      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                        {result.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.suggestions.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#4ADE80', marginBottom: 4 }}>Suggestions</div>
                      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                        {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 2 }}>Expected Approach</div>
                    <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{result.expectedApproach}</p>
                  </div>
                  <button
                    onClick={() => { setShowEditor(false); checkMutation.reset() }}
                    style={{ alignSelf: 'flex-start', fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    ← Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}