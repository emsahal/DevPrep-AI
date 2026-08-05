import * as React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  type BundledLanguage,
  type CodeFile,
} from '@/components/kibo-ui/code-block'
import { getSectionId } from './TableOfContents'

interface TopicContentProps {
  content: string
  language?: 'roman' | 'english'
  onSectionObserved?: (id: string) => void
}

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

function normalizeMarkdown(content: string) {
  return content
    .replace(/\s+(#{1,3}\s+)/g, '\n\n$1')
    .replace(/\s+(\d+\.\s+\*\*)/g, '\n$1')
    .replace(/\s+(-\s+)/g, '\n$1')
    .replace(/```(\w+)\s+/g, '```$1\n')
    .replace(/\s+```/g, '\n```')
    .trim()
}

function extractCodeText(node: React.ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractCodeText).join('')
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return extractCodeText(props.children)
  }
  return ''
}

const FILENAME_BY_LANG: Record<string, string> = {
  html: 'index.html',
  xml: 'index.html',
  css: 'styles.css',
  javascript: 'script.js',
  js: 'script.js',
  jsx: 'App.jsx',
  typescript: 'main.ts',
  ts: 'main.ts',
  tsx: 'App.tsx',
  python: 'main.py',
  py: 'main.py',
  bash: 'script.sh',
  sh: 'script.sh',
  shell: 'script.sh',
  json: 'data.json',
  c: 'main.c',
  cpp: 'main.cpp',
  java: 'Main.java',
  sql: 'query.sql',
  markdown: 'README.md',
  md: 'README.md',
  plaintext: 'code.txt',
}

function filenameForLanguage(language: string): string {
  const lang = language.toLowerCase()
  return FILENAME_BY_LANG[lang] ?? `snippet.${lang || 'txt'}`
}

export function TopicContent({ content, language = 'roman' }: TopicContentProps) {
  const formattedContent = normalizeMarkdown(getLanguageContent(content, language))

  const components = {
    h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
      <h1 className="mb-5 text-3xl font-extrabold leading-tight" style={{ color: 'var(--color-on-surface)' }} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => {
      const id = getSectionId(String(children))
      return (
        <h2 id={id} className="mt-8 mb-3 scroll-mt-24 border-t pt-6 text-xl font-bold" style={{ borderColor: 'var(--color-border-muted)', color: 'var(--color-primary)' }} {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => {
      const id = getSectionId(String(children))
      return (
        <h3 id={id} className="mt-6 mb-3 scroll-mt-24 text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }} {...props}>
          {children}
        </h3>
      )
    },
    p: (props: React.ComponentPropsWithoutRef<'p'>) => (
      <p className="mb-4 leading-7 text-muted-foreground" {...props} />
    ),
    ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
      <ul className="mb-4 list-disc pl-6 space-y-1 text-muted-foreground" {...props} />
    ),
    ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
      <ol className="mb-4 list-decimal pl-6 space-y-1 text-muted-foreground" {...props} />
    ),
    li: (props: React.ComponentPropsWithoutRef<'li'>) => (
      <li className="leading-7" {...props} />
    ),
    strong: (props: React.ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-bold" style={{ color: 'var(--color-on-surface)' }} {...props} />
    ),
    code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
      const isInline = !className
      if (isInline) {
        return (
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary" {...props}>
            {children}
          </code>
        )
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    pre: ({ children }: React.ComponentPropsWithoutRef<'pre'>) => {
      const codeChild = React.Children.toArray(children)[0]
      let language = ''
      let rawCode = ''

      if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(codeChild)) {
        language = String(codeChild.props.className ?? '')
          .replace(/^language-/, '')
          .trim()
        rawCode = extractCodeText(codeChild.props.children)
      } else {
        rawCode = extractCodeText(children)
      }

      const lang = language || 'plaintext'
      const data: CodeFile[] = [{ language: lang, filename: filenameForLanguage(lang), code: rawCode }]

      return (
        <CodeBlock data={data} defaultValue={lang}>
          <CodeBlockHeader className="justify-between">
            <CodeBlockFiles>
              {(item) => (
                <CodeBlockFilename key={item.language} value={item.language}>
                  {item.filename}
                </CodeBlockFilename>
              )}
            </CodeBlockFiles>
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem key={item.language} value={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      )
    },
    blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground" {...props} />
    ),
    a: (props: React.ComponentPropsWithoutRef<'a'>) => (
      <a className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
      <hr className="my-8 border-t" {...props} />
    ),
  }

  return (
    <div className="prose-custom max-w-none text-sm">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {formattedContent}
      </Markdown>
    </div>
  )
}
