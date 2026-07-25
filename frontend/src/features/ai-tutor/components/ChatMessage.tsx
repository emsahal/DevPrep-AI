import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, User } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '@/services/aiTutorService'

interface ChatMessageProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-custom max-w-none text-sm">
            <Markdown remarkPlugins={[remarkGfm]}>
              {message.content + (isStreaming ? '▊' : '')}
            </Markdown>
          </div>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
