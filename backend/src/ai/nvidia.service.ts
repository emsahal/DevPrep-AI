import { config } from '@/config'
import logger from '@/utils/logger'
import { getCached, setCache } from '@/utils/redis'

interface AIRequestOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export class NvidiaAIService {
  private baseUrl: string
  private apiKey: string
  private defaultModel: string

  constructor() {
    this.apiKey = process.env.NVIDIA_API_KEY || ''
    this.baseUrl = (process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '')
    this.defaultModel = process.env.NVIDIA_MODEL || 'openai/gpt-oss-20b'
    logger.info(`[NvidiaAI] Initialized with model=${this.defaultModel}`)
  }

  async generate(
    messages: Message[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    const cacheKey = `ai:nvidia:${options.model || this.defaultModel}:${messages[messages.length - 1]?.content?.substring(0, 50).replace(/\s+/g, '_')}`
    const cached = await getCached<AIResponse>(cacheKey)
    if (cached) return cached

    if (!this.apiKey) {
      throw new Error('NVIDIA_API_KEY is missing. Please define it in your backend environment variables or .env file.')
    }

    const model = options.model || this.defaultModel
    const url = `${this.baseUrl}/chat/completions`

    const payload = {
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`Nvidia API error: ${response.status} ${errorText}`)
      throw new Error(`Nvidia AI service returned status: ${response.status}`)
    }

    const data = (await response.json()) as any
    const content = data.choices?.[0]?.message?.content ?? ''
    const usage = data.usage
      ? {
          promptTokens: data.usage.prompt_tokens ?? 0,
          completionTokens: data.usage.completion_tokens ?? 0,
          totalTokens: data.usage.total_tokens ?? 0,
        }
      : undefined

    const result: AIResponse = { content, usage }
    await setCache(cacheKey, result, 3600)
    return result
  }

  async generateStream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options: AIRequestOptions = {}
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error('NVIDIA_API_KEY is missing. Please define it in your backend environment variables or .env file.')
    }

    const model = options.model || this.defaultModel
    const url = `${this.baseUrl}/chat/completions`

    const payload = {
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`Nvidia stream error: ${response.status} ${errorText}`)
      throw new Error(`Nvidia stream error: ${response.status}`)
    }

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
        const cleanLine = line.trim()
        if (!cleanLine.startsWith('data: ')) continue
        const data = cleanLine.slice(6).trim()
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          const text = parsed.choices?.[0]?.delta?.content
          if (text) onChunk(text)
        } catch {}
      }
    }
  }
}

export const nvidiaAI = new NvidiaAIService()
