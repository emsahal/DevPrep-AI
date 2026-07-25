import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Brain, BookOpen, FileText } from 'lucide-react'
import type { ActivityItem } from '@/services/dashboardService'

interface ActivityFeedProps {
  activities: ActivityItem[] | undefined
  isLoading: boolean
}

const activityIcons = {
  quiz: Brain,
  topic: BookOpen,
  revision: FileText,
}

const activityColors = {
  quiz: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
  topic: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
  revision: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!activities || activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No activity yet. Start learning to see your progress here.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, i) => {
              const Icon = activityIcons[activity.type]
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${activityColors[activity.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.action}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      {activity.score !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                          Score: {activity.score}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}
