import * as React from 'react'
import hljs from 'highlight.js'
import { Check, Copy, FileCode2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BundledLanguage = string

export interface CodeFile {
  language: BundledLanguage
  filename: string
  code: string
}

interface CodeBlockContextValue {
  data: CodeFile[]
  value: string
  setValue: (value: string) => void
  active: CodeFile
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null)

function useCodeBlock(): CodeBlockContextValue {
  const ctx = React.useContext(CodeBlockContext)
  if (!ctx) {
    throw new Error('CodeBlock components must be rendered inside <CodeBlock>')
  }
  return ctx
}

function escapeHtml(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function highlightCode(code: string, language?: BundledLanguage): string {
  const lang = language?.toLowerCase()
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang }).value
    } catch {
      /* fall through to plain text */
    }
  }
  return escapeHtml(code)
}

export interface CodeBlockProps {
  data: CodeFile[]
  defaultValue?: string
  className?: string
  children: React.ReactNode
}

export function CodeBlock({ data, defaultValue, className, children }: CodeBlockProps) {
  const [value, setValue] = React.useState(defaultValue ?? data[0]?.language)
  const active = data.find((d) => d.language === value) ?? data[0]

  return (
    <CodeBlockContext.Provider value={{ data, value, setValue, active }}>
      <div className={cn('my-4 overflow-hidden rounded-xl border border-white/10 text-sm shadow-lg', className)}>
        {children}
      </div>
    </CodeBlockContext.Provider>
  )
}

export function CodeBlockHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center gap-2 border-b border-white/10 bg-[#161b22] px-3 py-2', className)}>
      {children}
    </div>
  )
}

export function CodeBlockFiles({ children }: { children: (item: CodeFile) => React.ReactNode }) {
  const { data } = useCodeBlock()
  return <>{data.map((item) => children(item))}</>
}

export interface CodeBlockFilenameProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function CodeBlockFilename({ value, className, children, ...props }: CodeBlockFilenameProps) {
  const { value: current, setValue } = useCodeBlock()
  const active = current === value

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors',
        active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white',
        className
      )}
      {...props}
    >
      <FileCode2 className="h-3.5 w-3.5" />
      {children}
    </button>
  )
}

export function CodeBlockCopyButton({ className }: { className?: string }) {
  const { active } = useCodeBlock()
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code"
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white',
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function CodeBlockBody({ children }: { children: (item: CodeFile) => React.ReactNode }) {
  const { data } = useCodeBlock()
  return <>{data.map((item) => children(item))}</>
}

export function CodeBlockItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: current } = useCodeBlock()
  return current === value ? <>{children}</> : null
}

export function CodeBlockContent({
  language,
  children,
}: {
  language: BundledLanguage
  children: string
}) {
  const lang = language?.toLowerCase()
  const html = highlightCode(children, lang)

  return (
    <pre className="overflow-x-auto bg-[#0d1117] p-4 text-xs leading-relaxed">
      <code
        className={cn('font-mono', lang && `language-${lang}`)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  )
}
