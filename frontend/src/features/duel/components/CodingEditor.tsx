import { useRef, useEffect } from 'react'

interface CodingEditorProps {
  code: string
  onChange: (code: string) => void
  language: string
}

const LANG_MAP: Record<string, string> = {
  javascript: 'javascript',
  python: 'python',
  typescript: 'typescript',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  rust: 'rust',
  sql: 'sql',
}

export function CodingEditor({ code, onChange, language }: CodingEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      const ta = textareaRef.current
      if (e.key === 'Tab' && ta === document.activeElement) {
        e.preventDefault()
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const newVal = code.substring(0, start) + '  ' + code.substring(end)
        onChange(newVal)
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2
        })
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [code, onChange])

  return (
    <div className="relative w-full h-full" style={{ background: '#0d1117' }}>
      {/* Language badge */}
      <div className="absolute top-2 right-3 z-10 text-[10px] font-mono font-medium px-2 py-0.5 rounded"
           style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--color-outline)' }}>
        {LANG_MAP[language] || language}
      </div>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        className="w-full h-full resize-none outline-none p-4 text-sm leading-relaxed font-mono"
        style={{
          background: 'transparent',
          color: '#e6edf3',
          tabSize: 2,
          caretColor: 'var(--color-primary)',
        }}
      />
    </div>
  )
}
