import { useState, useMemo, useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import CodeMirror from '@uiw/react-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, type CompletionContext } from '@codemirror/autocomplete'
import { allQuestions, LEVELS } from '@/data/dsa-questions'
import { dsaCheckService } from '@/services/dsaCheckService'
import { useAuthStore } from '@/store/authStore'

type View = 'levels' | 'questions' | 'solve'

const levelColors = [
  { bg: 'var(--color-surface-container)', border: 'var(--color-border-muted)', accent: 'var(--color-primary)' },
  { bg: 'var(--color-surface-container)', border: 'var(--color-border-muted)', accent: 'var(--color-primary)' },
  { bg: 'var(--color-surface-container)', border: 'var(--color-border-muted)', accent: 'var(--color-primary)' },
  { bg: 'var(--color-surface-container)', border: 'var(--color-border-muted)', accent: 'var(--color-primary)' },
  { bg: 'var(--color-surface-container)', border: 'var(--color-border-muted)', accent: 'var(--color-primary)' },
]

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Easy: { bg: '#16A34A22', text: '#4ADE80' },
  Medium: { bg: '#EA580C22', text: '#FB923C' },
  Hard: { bg: '#DC262622', text: '#F87171' },
}

const levelNames: Record<number, string> = {
  1: 'Must Know',
  2: 'Very Common',
  3: 'Most Asked DSA',
  4: 'Trees',
  5: 'Dynamic Programming',
}

const cppKeywords = [
  'auto', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const',
  'constexpr', 'continue', 'default', 'delete', 'do', 'double', 'else',
  'enum', 'explicit', 'extern', 'false', 'float', 'for', 'friend', 'goto',
  'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept',
  'nullptr', 'operator', 'override', 'private', 'protected', 'public',
  'register', 'return', 'short', 'signed', 'sizeof', 'static', 'static_cast',
  'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef',
  'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void',
  'volatile', 'while',
]

const cppIdentifiers = [
  'cout', 'cin', 'endl', 'cerr', 'clog',
  'push_back', 'push', 'pop_back', 'pop', 'front', 'back',
  'top', 'empty', 'size', 'clear', 'erase', 'insert', 'find',
  'begin', 'end', 'rbegin', 'rend', 'sort', 'reverse',
  'min', 'max', 'swap', 'abs', 'make_pair',
  'true', 'false', 'NULL', 'nullptr',
]

const cppHeaders = [
  'iostream', 'vector', 'algorithm', 'string', 'map', 'unordered_map',
  'set', 'unordered_set', 'queue', 'stack', 'deque', 'list', 'utility',
  'cmath', 'cstdlib', 'cstdio', 'cstring', 'ctime', 'climits',
  'fstream', 'sstream', 'memory', 'functional', 'iterator', 'numeric',
  'array', 'tuple', 'bitset', 'regex', 'thread', 'mutex',
]

const cppCompletionSource = (context: CompletionContext) => {
  const includeMatch = context.matchBefore(/#include\s*<(\w*)/)
  if (includeMatch && includeMatch.from > -1) {
    const prefix = (includeMatch[1] || '').toLowerCase()
    const base = includeMatch.from + '#include <'.length - (includeMatch[1] || '').length
    return {
      from: base,
      options: cppHeaders
        .filter(h => h.startsWith(prefix))
        .map(h => ({ label: h, type: 'keyword' as const })),
    }
  }

  const word = context.matchBefore(/\w+/)
  if (!word && !context.explicit) return null

  const prefix = word.text.toLowerCase()
  const allOptions = [
    ...cppKeywords.filter(k => k.startsWith(prefix)).map(k => ({ label: k, type: 'keyword' as const })),
    ...cppIdentifiers.filter(k => k.startsWith(prefix)).map(k => ({ label: k, type: 'keyword' as const })),
  ]
  return { from: word.from, options: allOptions }
}

export function CodeAnalyzerPage() {
  const [view, setView] = useState<View>('levels')
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<'cpp' | 'javascript'>('cpp')
  const [showEditor, setShowEditor] = useState(false)
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('solvedQuestions') || '[]')) } catch { return new Set<string>() }
  })
  const [savedSolutions, setSavedSolutions] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('savedSolutions') || '{}') } catch { return {} }
  })

  const user = useAuthStore(state => state.user)

  useEffect(() => {
    localStorage.setItem('solvedQuestions', JSON.stringify([...solvedQuestions]))
  }, [solvedQuestions])

  useEffect(() => {
    localStorage.setItem('savedSolutions', JSON.stringify(savedSolutions))
  }, [savedSolutions])

  const question = useMemo(() => {
    if (!selectedId) return null
    return allQuestions.find(q => q.id === selectedId) ?? null
  }, [selectedId])

  const extensions = useMemo(() => {
    const lang = language === 'cpp' ? cpp() : javascript()
    const auto = autocompletion({
      activateOnTyping: true,
      override: language === 'cpp' ? [cppCompletionSource] : undefined,
    })
    return [lang, auto]
  }, [language])

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
    }, {
      onSuccess: (data) => {
        if (data.isCorrect && question) {
          setSolvedQuestions(prev => new Set(prev).add(question.id))
          const solutionKey = user ? `${user.id}_${question.id}` : question.id
          setSavedSolutions(prev => ({ ...prev, [solutionKey]: code }))
        }
      },
    })
  }

  const result = checkMutation.data

  return (
<div className="flex flex-col min-h-0">
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--color-surface-container-lowest)' }}>

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
                  const solvedCount = levelQ.filter(q => solvedQuestions.has(q.id)).length
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
                        background: 'var(--color-surface-container-high, rgba(139,92,246,0.1))', fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0,
                      }}>
                        {level.level}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: 2 }}>Level {level.level}: {level.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
                          {level.topics.map(t => t.name).join(' • ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, color: solvedCount === levelQ.length ? '#4ADE80' : 'var(--color-outline)' }}>
                          {solvedCount}/{levelQ.length} solved
                        </div>
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
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                                {solvedQuestions.has(q.id) && <span style={{ color: '#4ADE80', fontSize: 14 }}>✓</span>}
                                {q.title}
                              </span>
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
                    <CodeMirror
                      value={code}
                      onChange={setCode}
                      extensions={extensions}
                      theme={oneDark}
                      height="auto"
                      minHeight="250px"
                      style={{ flex: 1, fontSize: 13 }}
                      basicSetup={{
                        lineNumbers: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        indentOnInput: true,
                        tabSize: 2,
                        highlightActiveLine: true,
                      }}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 10, border: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container)', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 700,
                      background: result.isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: result.isCorrect ? '#4ADE80' : '#F87171',
                    }}>
                      {result.isCorrect ? '✓' : '✗'}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: result.isCorrect ? '#4ADE80' : '#F87171' }}>
                        {result.isCorrect ? 'Correct Solution' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{result.feedback}</p>
                  {!result.isCorrect && result.issues.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#F87171', marginBottom: 4 }}>Issues</div>
                      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>
                        {result.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                      </ul>
                    </div>
                  )}
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