import api from '@/lib/axios'

export type AITutorAction =
  | 'explain'
  | 'simplify'
  | 'examples'
  | 'summary'
  | 'notes'
  | 'questions'
  | 'compare'
  | 'chat'
  | 'personalize'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ChatResponse {
  content: string
  sessionId: string
}

export interface ChatHistoryResponse {
  messages: ChatMessage[]
  sessions: Array<{
    sessionId: string
    messageCount: number
    createdAt: string
  }>
}

export const aiTutorService = {
  async sendMessage(
    query: string,
    type: AITutorAction = 'chat',
    context = '',
    sessionId?: string
  ): Promise<ChatResponse> {
    const { data } = await api.post('/ai-tutor/chat', { query, type, context, sessionId })
    return data
  },

  async sendMessageStream(
    query: string,
    type: AITutorAction = 'chat',
    context = '',
    sessionId: string | undefined,
    onChunk: (content: string) => void,
    onDone: (sessionId: string) => void
  ): Promise<void> {
    const token = localStorage.getItem('accessToken')

    const response = await fetch('/api/ai-tutor/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, type, context, sessionId }),
    })

    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.done) {
              onDone(parsed.sessionId)
              return
            }
            if (parsed.content) {
              onChunk(parsed.content)
            }
          } catch {
            // skip
          }
        }
      }
    }
  },

  async getHistory(sessionId?: string): Promise<ChatHistoryResponse> {
    const params = sessionId ? { sessionId } : {}
    const { data } = await api.get('/ai-tutor/history', { params })
    return data
  },

  async clearHistory(sessionId?: string) {
    await api.delete('/ai-tutor/history', { data: { sessionId } })
  },
}
