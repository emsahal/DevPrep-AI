import { config } from '@/config'
import logger from '@/utils/logger'
import { getCached, setCache } from '@/utils/redis'

interface AIRequestOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
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

class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests = 60, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter((t) => now - t < this.windowMs)
    if (this.requests.length >= this.maxRequests) return false
    this.requests.push(now)
    return true
  }
}

const rateLimiter = new RateLimiter()

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class NvidiaAIService {
  private baseUrl: string
  private apiKey: string
  private defaultModel: string

  constructor() {
    this.baseUrl = config.nvidia.baseUrl.replace(/\/$/, '')
    this.apiKey = config.nvidia.apiKey
    this.defaultModel = config.nvidia.model || 'meta/llama-3.1-405b-instruct'
    logger.info(`[NvidiaAI] apiKey=${this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'EMPTY'} model=${this.defaultModel}`)
  }

  async generate(
    messages: Message[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    const cacheKey = this.getCacheKey(messages, options)
    const cached = await getCached<AIResponse>(cacheKey)
    if (cached) return cached

    if (!this.apiKey) {
      return this.getFallbackResponse()
    }

    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait before sending another request.')
    }

    const model = options.model || this.defaultModel
    const url = `${this.baseUrl}/chat/completions`

    const payload = {
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
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

          if (response.status === 429 && attempt < 2) {
            await sleep(Math.pow(2, attempt) * 2000)
            continue
          }

          if (response.status >= 500 && attempt < 2) {
            await sleep(Math.pow(2, attempt) * 1000)
            continue
          }

          throw new Error(`AI service error: ${response.status}`)
        }

        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>
          usage?: {
            prompt_tokens?: number
            completion_tokens?: number
            total_tokens?: number
          }
        }

        const content = data.choices?.[0]?.message?.content ?? ''
        const meta = data.usage

        const result: AIResponse = {
          content,
          usage: meta
            ? {
                promptTokens: meta.prompt_tokens ?? 0,
                completionTokens: meta.completion_tokens ?? 0,
                totalTokens: meta.total_tokens ?? 0,
              }
            : undefined,
        }

        await setCache(cacheKey, result, 3600)
        return result
      } catch (error) {
        if (attempt === 2) throw error
        logger.warn(`Nvidia AI request attempt ${attempt + 1} failed, retrying...`)
        await sleep(Math.pow(2, attempt) * 1000)
      }
    }

    return this.getFallbackResponse()
  }

  async generateStream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options: AIRequestOptions = {}
  ): Promise<void> {
    if (!this.apiKey) {
      const fallback = this.getFallbackResponse()
      onChunk(fallback.content)
      return
    }

    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait before sending another request.')
    }

    const model = options.model || this.defaultModel
    const url = `${this.baseUrl}/chat/completions`

    const payload = {
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
      stream: true,
    }

    try {
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
        onChunk('Sorry, the AI service returned an error. Please try again.')
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        onChunk('Unable to read stream')
        return
      }

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
          if (!cleanLine) continue

          if (cleanLine.startsWith('data: ')) {
            const data = cleanLine.slice(6).trim()
            if (data === '[DONE]') return
            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>
              }
              const text = parsed.choices?.[0]?.delta?.content
              if (text) onChunk(text)
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }
    } catch (error) {
      logger.error('Nvidia stream error:', error)
      const fallback = this.getFallbackResponse()
      onChunk(fallback.content)
    }
  }

  private getCacheKey(messages: Message[], options: AIRequestOptions): string {
    const lastMsg = messages[messages.length - 1]?.content?.substring(0, 100) || ''
    return `ai:nvidia:${options.model || this.defaultModel}:${lastMsg.replace(/\s+/g, '_')}`
  }

  private getFallbackResponse(): AIResponse {
    return {
      content:
        'The Nvidia AI service is temporarily unavailable. Please check your NVIDIA_API_KEY in the backend .env file and try again.',
    }
  }
}

export const nvidiaAI = new NvidiaAIService()
