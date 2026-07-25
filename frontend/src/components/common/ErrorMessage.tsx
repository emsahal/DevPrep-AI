import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      )}
    </div>
  )
}
