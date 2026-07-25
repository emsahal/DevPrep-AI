import { useState, useRef, useEffect, useCallback } from 'react'
import { aiTutorService } from '@/services/aiTutorService'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Message = { role: 'assistant' | 'user'; text: string }

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

export function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I\'m your DevPrep AI tutor. I can help you understand technical concepts, review code, and prepare you for interviews. What would you like to learn today?' },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const streamingRef = useRef('')
  const bottomRef = useRef<HTMLDivElement>(null)

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
      undefined,
      (chunk) => {
        streamingRef.current += chunk
        setStreamingContent(streamingRef.current)
      },
      (sessionId) => {
        // Use ref value to ensure we have the complete content
        const finalContent = streamingRef.current
        setMessages(prev => [...prev, { role: 'assistant', text: finalContent }])
        // Clear streaming state AFTER message is added to messages
        setIsStreaming(false)
        setStreamingContent('')
        streamingRef.current = ''
      }
    )
  }, [])

  const SUGGESTIONS = ['Explain JavaScript closures', 'What is a closure vs a class?', 'How does the event loop work?', 'Review my code for bugs']

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto px-4 py-5">
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
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-success)' }}>Online · GPT-4o</span>
              </div>
            </div>
          </div>
        </div>

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

        {messages.length === 1 && (
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
      </div>
    </div>
  )
}