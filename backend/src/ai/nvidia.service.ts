import { config } from '@/config'
import logger from '@/utils/logger'
import { getCached, setCache } from '@/utils/redis'

// ──────────────────────────────────────────────────────────────
// Interfaces (kept identical to the old service so callers don't
// need any changes)
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// Rate limiter (unchanged)
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// Gemini payload helpers
// ──────────────────────────────────────────────────────────────

/** Convert OpenAI-style messages into Gemini's `contents` array.
 *  System messages are pulled out into `system_instruction`. */
function toGeminiPayload(
  messages: Message[],
  options: AIRequestOptions
): Record<string, unknown> {
  const systemMsg = messages.find((m) => m.role === 'system')
  const conversationMsgs = messages.filter((m) => m.role !== 'system')

  const contents = conversationMsgs.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 1,
      maxOutputTokens: options.maxTokens ?? 8192,
    },
  }

  if (systemMsg) {
    payload.system_instruction = {
      parts: [{ text: systemMsg.content }],
    }
  }

  return payload
}

// ──────────────────────────────────────────────────────────────
// Main service class (same name kept for backward compatibility)
// ──────────────────────────────────────────────────────────────
export class NvidiaAIService {
  private baseUrl: string
  private apiKey: string
  private defaultModel: string

  constructor() {
    this.baseUrl = config.gemini.baseUrl
    this.apiKey = config.gemini.apiKey
    this.defaultModel = config.gemini.model || 'gemini-2.5-flash'
    logger.info(`[GeminiAI] apiKey=${this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'EMPTY'} model=${this.defaultModel}`)
  }

  // ────────────────────────────────────────────
  // generate() — non-streaming
  // ────────────────────────────────────────────
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
    const url = `${this.baseUrl}/models/${model}:generateContent`
    const payload = toGeminiPayload(messages, options)

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': this.apiKey,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          logger.error(`Gemini API error: ${response.status} ${errorText}`)

          if (response.status === 429) {
            // Parse retry delay from Gemini response
            let retryMsg = 'Please wait a moment and try again.'
            try {
              const errJson = JSON.parse(errorText)
              const retryDelay = errJson?.error?.details?.find(
                (d: Record<string, unknown>) => d['@type']?.toString().includes('RetryInfo')
              )?.retryDelay
              if (retryDelay) retryMsg = `Please retry in ${retryDelay}.`
            } catch { /* ignore */ }
            return {
              content: `⚠️ **API quota exceeded.** The free-tier daily limit for this Gemini model has been reached. ${retryMsg}\n\nYou can also try switching to a different model in your \`.env\` file (e.g. \`gemini-2.5-flash\`).`,
            }
          }

          if (response.status >= 500 && attempt < 2) {
            await sleep(Math.pow(2, attempt) * 1000)
            continue
          }

          throw new Error(`AI service error: ${response.status}`)
        }

        const data = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
          usageMetadata?: {
            promptTokenCount?: number
            candidatesTokenCount?: number
            totalTokenCount?: number
          }
        }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const meta = data.usageMetadata

        const result: AIResponse = {
          content,
          usage: meta
            ? {
                promptTokens: meta.promptTokenCount ?? 0,
                completionTokens: meta.candidatesTokenCount ?? 0,
                totalTokens: meta.totalTokenCount ?? 0,
              }
            : undefined,
        }

        await setCache(cacheKey, result, 3600)
        return result
      } catch (error) {
        if (attempt === 2) throw error
        logger.warn(`AI request attempt ${attempt + 1} failed, retrying...`)
        await sleep(Math.pow(2, attempt) * 1000)
      }
    }

    return this.getFallbackResponse()
  }

  // ────────────────────────────────────────────
  // generateStream() — SSE streaming
  // ────────────────────────────────────────────
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
    // alt=sse tells Gemini to return a Server-Sent Events stream
    const url = `${this.baseUrl}/models/${model}:streamGenerateContent?alt=sse`
    const payload = toGeminiPayload(messages, options)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`Gemini stream error: ${response.status} ${errorText}`)
        if (response.status === 429) {
          let retryMsg = 'Please wait a moment and try again.'
          try {
            const errJson = JSON.parse(errorText)
            const retryDelay = errJson?.error?.details?.find(
              (d: Record<string, unknown>) => d['@type']?.toString().includes('RetryInfo')
            )?.retryDelay
            if (retryDelay) retryMsg = `Please retry in ${retryDelay}.`
          } catch { /* ignore */ }
          onChunk(`⚠️ **API quota exceeded.** The free-tier daily limit for this Gemini model has been reached. ${retryMsg}\n\nYou can also try switching to a different model in your \`.env\` file (e.g. \`gemini-2.5-flash\`).`)
          return
        }
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
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') return
            try {
              const parsed = JSON.parse(data) as {
                candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
              }
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) onChunk(text)
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }
    } catch (error) {
      logger.error('Gemini stream error:', error)
      const fallback = this.getFallbackResponse()
      onChunk(fallback.content)
    }
  }

  // ────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────
  private getCacheKey(messages: Message[], options: AIRequestOptions): string {
    const lastMsg = messages[messages.length - 1]?.content?.substring(0, 100) || ''
    return `ai:${options.model || this.defaultModel}:${lastMsg.replace(/\s+/g, '_')}`
  }

  private getFallbackResponse(): AIResponse {
    return {
      content:
        'The AI service is temporarily unavailable. Please check your GEMINI_API_KEY in the backend .env file and try again.',
    }
  }
}

export const nvidiaAI = new NvidiaAIService()
