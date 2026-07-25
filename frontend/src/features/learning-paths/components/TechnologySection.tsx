import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PathTechnology } from '@/services/learningPathService'
import { useAuthStore } from '@/store/authStore'

interface TechnologySectionProps {
  technology: PathTechnology
  index: number
}

export function TechnologySection({ technology, index }: TechnologySectionProps) {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b bg-muted/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="font-semibold">{technology.name}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {technology.topics.length} topics
          </Badge>
        </div>
      </div>
      <div className="divide-y">
        {technology.topics.map((topic) => {
          const isLocked = !isAuthenticated

          return (
            <Link
              key={topic.id}
              to={isLocked ? '/login' : `/topics/${topic.slug}`}
              className={cn(
                'flex items-center gap-3 px-6 py-3 transition-colors hover:bg-accent',
                isLocked && 'opacity-60'
              )}
            >
              {topic.completed ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              ) : isLocked ? (
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{topic.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{topic.description}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs capitalize',
                  topic.difficulty === 'beginner' && 'border-green-200 text-green-600 dark:border-green-800 dark:text-green-400',
                  topic.difficulty === 'intermediate' && 'border-yellow-200 text-yellow-600 dark:border-yellow-800 dark:text-yellow-400',
                  topic.difficulty === 'advanced' && 'border-red-200 text-red-600 dark:border-red-800 dark:text-red-400'
                )}
              >
                {topic.difficulty}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
