import { cn } from '@/lib/utils'

interface PathProgressProps {
  completed: number
  total: number
  progress: number
}

export function PathProgress({ completed, total, progress }: PathProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{completed} / {total} topics</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            progress === 100 ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-right text-sm text-muted-foreground">{progress}% complete</p>
    </div>
  )
}
