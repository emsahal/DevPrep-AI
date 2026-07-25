import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen } from 'lucide-react'
import type { Topic } from '@/types'

interface ContinueLearningProps {
  topics: Topic[] | undefined
  isLoading: boolean
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
} as const

export function ContinueLearning({ topics, isLoading }: ContinueLearningProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!topics || topics.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No topics available yet.
          </p>
        ) : (
          topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/topics/${topic.slug}`}
              className="group block rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {topic.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {topic.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-2 text-xs ${
                    difficultyColors[topic.difficulty as keyof typeof difficultyColors] || ''
                  }`}
                >
                  {topic.difficulty}
                </Badge>
              </div>
              <div className="mt-2 flex items-center text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Continue <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
