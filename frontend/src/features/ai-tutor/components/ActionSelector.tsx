import { cn } from '@/lib/utils'
import type { AITutorAction } from '@/services/aiTutorService'
import {
  BookOpen,
  Lightbulb,
  Code2,
  FileText,
  StickyNote,
  HelpCircle,
  GitCompare,
  MessageSquare,
  User,
} from 'lucide-react'

interface ActionItem {
  value: AITutorAction
  label: string
  description: string
  icon: React.ElementType
}

const actions: ActionItem[] = [
  { value: 'chat', label: 'Chat', description: 'Ask anything', icon: MessageSquare },
  { value: 'explain', label: 'Explain', description: 'Understand a concept', icon: BookOpen },
  { value: 'simplify', label: 'Simplify', description: 'Break it down', icon: Lightbulb },
  { value: 'examples', label: 'Examples', description: 'See code examples', icon: Code2 },
  { value: 'summary', label: 'Summary', description: 'Get the gist', icon: FileText },
  { value: 'notes', label: 'Notes', description: 'Study notes', icon: StickyNote },
  { value: 'questions', label: 'Questions', description: 'Practice questions', icon: HelpCircle },
  { value: 'compare', label: 'Compare', description: 'Compare concepts', icon: GitCompare },
  { value: 'personalize', label: 'Personalize', description: 'Learning plan', icon: User },
]

interface ActionSelectorProps {
  selected: AITutorAction
  onSelect: (action: AITutorAction) => void
}

export function ActionSelector({ selected, onSelect }: ActionSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.value}
          onClick={() => onSelect(action.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            selected === action.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
          title={action.description}
        >
          <action.icon className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  )
}
