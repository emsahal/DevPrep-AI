import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Code2, GraduationCap, BookOpen } from 'lucide-react'

const actions = [
  {
    label: 'AI Tutor',
    description: 'Ask anything about your topics',
    icon: Brain,
    href: '/ai-tutor',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    label: 'Code Analyzer',
    description: 'Analyze and improve your code',
    icon: Code2,
    href: '/code-analyzer',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    label: 'Daily Quiz',
    description: 'Test your knowledge daily',
    icon: GraduationCap,
    href: '/quizzes',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  {
    label: 'Flashcards',
    description: 'Review with spaced repetition',
    icon: BookOpen,
    href: '/flashcards',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <div className={`rounded-lg p-2 ${action.bgColor}`}>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <div>
              <h4 className="text-sm font-medium">{action.label}</h4>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
