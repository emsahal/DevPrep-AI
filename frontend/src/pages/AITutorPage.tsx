import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { aiTutorService } from '@/services/aiTutorService'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Message = { role: 'assistant' | 'user'; text: string }
type SessionInfo = { sessionId: string; messageCount: number; createdAt: string; title: string }

function BotMessage({ text }: { text: string }) {
  return (
    <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none text-base leading-relaxed" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', fontSize: '15px', lineHeight: '1.7' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong({ children }) { return <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{children}</strong> },
          code({ className, children, ...props }) {
            const isInline = !className
            if (isInline) return <code className="px-1 py-0.5 rounded text-sm font-code" style={{ background: 'var(--color-surface-container)', color: 'var(--color-primary)', fontSize: '13px' }} {...props}>{children}</code>
            return (
              <div className="rounded-xl overflow-hidden my-3 text-sm" style={{ border: '1px solid var(--color-border-muted)' }}>
                <pre className="p-4 m-0 overflow-x-auto font-code" style={{ background: 'var(--color-surface)', fontSize: '13px', lineHeight: '1.6' }}>
                  <code className={className} {...props}>{children}</code>
                </pre>
              </div>
            )
          },
          ul({ children }) { return <ul className="space-y-1.5 my-2" style={{ paddingLeft: '20px', fontSize: '15px', lineHeight: '1.7' }}>{children}</ul> },
          ol({ children }) { return <ol className="space-y-1.5 my-2" style={{ paddingLeft: '20px', fontSize: '15px', lineHeight: '1.7' }}>{children}</ol> },
          li({ children }) { return <li style={{ color: 'var(--color-on-surface-variant)' }}>{children}</li> },
          p({ children }) { return <p className="mb-2" style={{ color: 'var(--color-on-surface-variant)', fontSize: '15px', lineHeight: '1.7' }}>{children}</p> },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

const WELCOME_MSG: Message = { role: 'assistant', text: 'Hello! I\'m your DevPrep AI tutor. I can help you understand technical concepts, review code, and prepare you for interviews. What would you like to learn today?' }

export function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const streamingRef = useRef('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Chat history sidebar state
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const [searchParams] = useSearchParams()

  // Prefill input with a topic-specific template prompt when navigated from a topic page
  useEffect(() => {
    const topic = searchParams.get('topic')
    if (topic) {
      setInput(`Ask me about "${topic}". Please explain ${topic} in simple, beginner-friendly terms written in Roman Urdu (Urdu in Latin script) with a short English code example, and list 3 common interview questions a recruiter might ask about ${topic}.`)
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load sessions list on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setLoadingSessions(true)
    try {
      const data = await aiTutorService.getHistory()
      setSessions(data.sessions || [])
    } catch {
      // silently fail
    }
    setLoadingSessions(false)
  }

  // Load a specific session's messages
  const loadSession = async (sid: string) => {
    setLoadingMessages(true)
    try {
      const data = await aiTutorService.getHistory(sid)
      const loaded: Message[] = data.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        text: m.content,
      }))
      setMessages(loaded.length > 0 ? loaded : [WELCOME_MSG])
      setSessionId(sid)
      setActiveSessionId(sid)
      setSidebarOpen(false)
    } catch {
      // silently fail
    }
    setLoadingMessages(false)
  }

  // Start a new chat
  const handleNewChat = () => {
    setMessages([WELCOME_MSG])
    setSessionId(undefined)
    setActiveSessionId(null)
    setInput('')
    setIsStreaming(false)
    setStreamingContent('')
    streamingRef.current = ''
    setSidebarOpen(false)
  }

  // Delete a session
  const handleDeleteSession = async (sid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await aiTutorService.clearHistory(sid)
      setSessions(prev => prev.filter(s => s.sessionId !== sid))
      if (activeSessionId === sid) {
        handleNewChat()
      }
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const send = useCallback((text: string) => {
    if (!text.trim() || isStreaming) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsStreaming(true)
    setStreamingContent('')
    streamingRef.current = ''

    aiTutorService.sendMessageStream(
      text,
      'chat',
      '',
      sessionId,
      (chunk) => {
        streamingRef.current += chunk
        setStreamingContent(streamingRef.current)
      },
      (newSessionId) => {
        // Use ref value to ensure we have the complete content
        const finalContent = streamingRef.current
        setMessages(prev => [...prev, { role: 'assistant', text: finalContent }])
        setSessionId(newSessionId)
        setActiveSessionId(newSessionId)
        // Clear streaming state AFTER message is added to messages
        setIsStreaming(false)
        setStreamingContent('')
        streamingRef.current = ''
        // Refresh sessions list after a new message
        loadSessions()
      }
    )
  }, [isStreaming, sessionId])

  const SUGGESTIONS = ['Explain JavaScript closures', 'What is a closure vs a class?', 'How does the event loop work?', 'Review my code for bugs']

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="flex h-[calc(100vh-64px)] max-w-5xl mx-auto px-4 py-5 gap-3">

      {/* Chat History Sidebar */}
      <div
        className="flex flex-col rounded-2xl transition-all duration-300 overflow-hidden flex-shrink-0"
        style={{
          width: sidebarOpen ? 280 : 48,
          border: '1px solid var(--color-border-subtle)',
          background: 'var(--color-surface-container-lowest)',
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center px-3 py-3 gap-2" style={{ borderBottom: sidebarOpen ? '1px solid var(--color-border-muted)' : 'none' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
            style={{ background: 'var(--color-surface-container)', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
            title={sidebarOpen ? 'Close sidebar' : 'Chat history'}
          >
            <span className="material-symbols-outlined text-[18px]">{sidebarOpen ? 'menu_open' : 'history'}</span>
          </button>
          {sidebarOpen && (
            <>
              <span className="text-xs font-bold flex-1" style={{ color: 'var(--color-on-surface)' }}>Chat History</span>
              <button
                onClick={handleNewChat}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                style={{ background: 'rgba(208,188,255,0.12)', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                title="New chat"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </>
          )}
        </div>

        {/* Session List */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2 space-y-1">
            {loadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-[20px]" style={{ color: 'var(--color-outline)' }}>progress_activity</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <span className="material-symbols-outlined text-[24px]" style={{ color: 'var(--color-outline)' }}>chat_bubble_outline</span>
                <p className="text-[11px] text-center" style={{ color: 'var(--color-outline)' }}>No chat history yet.<br />Start a conversation!</p>
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.sessionId}
                  onClick={() => loadSession(s.sessionId)}
                  className="w-full text-left px-3 py-2.5 rounded-xl transition-all group relative"
                  style={{
                    background: activeSessionId === s.sessionId ? 'rgba(208,188,255,0.12)' : 'transparent',
                    border: activeSessionId === s.sessionId ? '1px solid rgba(208,188,255,0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <p
                    className="text-xs font-medium truncate pr-6"
                    style={{ color: activeSessionId === s.sessionId ? 'var(--color-primary)' : 'var(--color-on-surface)' }}
                  >
                    {s.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]" style={{ color: 'var(--color-outline)' }}>{formatDate(s.createdAt)}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-outline)' }}>· {s.messageCount} msgs</span>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteSession(s.sessionId, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                    title="Delete chat"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </button>
              ))
            )}
          </div>
        )}

        {/* Collapsed: just show the history icon */}
        {!sidebarOpen && (
          <div className="flex-1 flex flex-col items-center pt-2 gap-2">
            <button
              onClick={handleNewChat}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
              style={{ background: 'rgba(208,188,255,0.12)', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
              title="New chat"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl" style={{ border: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-lowest)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border-muted)', background: 'var(--color-surface-container-low)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary)/15', border: '1px solid rgba(208,188,255,0.3)' }}>
              <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>DevPrep AI Tutor</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-success)' }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-success)' }}>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading overlay when switching sessions */}
        {loadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[32px]" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
              <p className="text-xs" style={{ color: 'var(--color-outline)' }}>Loading conversation...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(208,188,255,0.15)', border: '1px solid rgba(208,188,255,0.3)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm" style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>U</div>
                  )}
                  {m.role === 'user' ? (
                    <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tr-none text-sm leading-relaxed"
                         style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)', fontSize: '15px', lineHeight: '1.7' }}>
                      {m.text}
                    </div>
                  ) : (
                    <BotMessage text={m.text} />
                  )}
                </div>
              ))}
              {isStreaming && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(208,188,255,0.15)', border: '1px solid rgba(208,188,255,0.3)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>smart_toy</span>
                  </div>
                  <BotMessage text={streamingContent + '▊'} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length === 1 && !activeSessionId && (
              <div className="px-5 py-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:border-primary hover:text-primary"
                          style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)', background: 'var(--color-surface-container)' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="p-4" style={{ borderTop: '1px solid var(--color-border-muted)', background: 'var(--color-surface-container-lowest)' }}>
              <div className="relative flex items-center gap-2 rounded-2xl px-4 py-3 ai-glow-focus"
                   style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                  type="text"
                  placeholder="Ask me anything about coding, algorithms, system design…"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}
                />
                <button onClick={() => send(input)} disabled={!input.trim() || isStreaming}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
              <p className="text-center text-[10px] mt-2" style={{ color: 'var(--color-outline)' }}>
                AI can make mistakes. Always verify critical information.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}