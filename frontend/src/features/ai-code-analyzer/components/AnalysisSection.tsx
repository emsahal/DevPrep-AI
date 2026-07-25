import { cn } from '@/lib/utils'
import { AlertTriangle, Bug, Lightbulb, RefreshCw, Activity, Shield, FileText, Beaker, Clock, Cpu, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface AnalysisSectionProps {
  title: string
  items: string[]
  type?: 'bugs' | 'logicErrors' | 'codeSmells' | 'security' | 'performance' | 'default'
  defaultOpen?: boolean
}

const sectionIcons = {
  explanation: FileText,
  bugs: Bug,
  logicErrors: AlertTriangle,
  codeSmells: Lightbulb,
  refactoring: RefreshCw,
  readability: FileText,
  maintainability: Activity,
  performance: Clock,
  security: Shield,
  testCases: Beaker,
  timeComplexity: Clock,
  spaceComplexity: Cpu,
}

const sectionColors = {
  bugs: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
  logicErrors: 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950',
  codeSmells: 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950',
  security: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
  performance: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
  default: 'border-muted bg-muted/50',
}

interface AnalysisItemProps {
  title: string
  icon: keyof typeof sectionIcons
  children: React.ReactNode
  color?: string
  defaultOpen?: boolean
}

export function AnalysisItem({ title, icon: iconKey, children, color, defaultOpen = true }: AnalysisItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Icon = sectionIcons[iconKey] || FileText

  return (
    <div className={cn('rounded-lg border overflow-hidden', color || sectionColors.default)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="border-t px-4 py-3 text-sm">{children}</div>}
    </div>
  )
}

export function AnalysisSection({ title, items, type = 'default', defaultOpen = true }: AnalysisSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Icon = sectionIcons[title.toLowerCase().replace(/\s+/g, '') as keyof typeof sectionIcons] || FileText
  const color = sectionColors[type] || sectionColors.default

  if (!items || items.length === 0) return null

  return (
    <div className={cn('rounded-lg border overflow-hidden', color)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{title} ({items.length})</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
