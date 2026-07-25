import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, TrendingUp, Flame } from 'lucide-react'
import type { DashboardStats } from '@/services/dashboardService'

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

const statConfigs = [
  {
    key: 'completedTopics',
    label: 'Topics Completed',
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    format: (v: number, s: DashboardStats) => `${v} / ${s.totalTopics}`,
  },
  {
    key: 'avgQuizScore',
    label: 'Average Quiz Score',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    format: (v: number) => `${v}%`,
  },
  {
    key: 'completionRate',
    label: 'Completion Rate',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    format: (v: number) => `${v}%`,
  },
  {
    key: 'streakDays',
    label: 'Day Streak',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    format: (v: number) => `${v} days`,
  },
]

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfigs.map((config) => {
        const value = stats[config.key as keyof DashboardStats] as number
        return (
          <Card key={config.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {config.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${config.bgColor}`}>
                <config.icon className={`h-4 w-4 ${config.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.format(value, stats)}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
