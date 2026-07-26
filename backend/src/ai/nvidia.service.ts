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
}

function toGeminiPayload(messages: Message[]) {
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const systemInstruction = messages.find((m) => m.role === 'system')?.content

  return {
    contents,
    ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  }
}

export class NvidiaAIService {
  private isNvidiaMode: boolean
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor() {
    const nvidiaKey = process.env.NVIDIA_API_KEY || ''
    const geminiKey = process.env.GEMINI_API_KEY || ''

    if (nvidiaKey) {
      this.isNvidiaMode = true
      this.apiKey = nvidiaKey
      this.baseUrl = (process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '')
      this.model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-405b-instruct'
      logger.info(`[NvidiaAI] Running in NVIDIA Mode. Model: ${this.model}`)
    } else {
      this.isNvidiaMode = false
      this.apiKey = geminiKey
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
      this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
      logger.info(`[NvidiaAI] Running in GEMINI Fallback Mode (No NVIDIA key found). Model: ${this.model}`)
    }
  }

  async generate(messages: Message[], options: AIRequestOptions = {}): Promise<AIResponse> {
    const cacheKey = `ai:nvidia:${this.model}:${messages[messages.length - 1]?.content?.substring(0, 50).replace(/\s+/g, '_')}`
    const cached = await getCached<AIResponse>(cacheKey)
    if (cached) return cached

    if (!this.apiKey) {
      throw new Error('No AI API key found. Please define NVIDIA_API_KEY or GEMINI_API_KEY in your .env file.')
    }

    if (this.isNvidiaMode) {
      // NVIDIA call
      const url = `${this.baseUrl}/chat/completions`
      const payload = {
        model: this.model,
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
        throw new Error(`Nvidia API error: ${response.status} ${await response.text()}`)
      }

      const data = await response.json() as any
      const content = data.choices?.[0]?.message?.content ?? ''
      const result = { content }
      await setCache(cacheKey, result, 3600)
      return result
    } else {
      // Gemini call
      const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`
      const payload = toGeminiPayload(messages)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${await response.text()}`)
      }

      const data = await response.json() as any
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      const result = { content }
      await setCache(cacheKey, result, 3600)
      return result
    }
  }

  async generateStream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options: AIRequestOptions = {}
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error('No AI API key found. Please define NVIDIA_API_KEY or GEMINI_API_KEY in your .env file.')
    }

    if (this.isNvidiaMode) {
      // NVIDIA stream
      const url = `${this.baseUrl}/chat/completions`
      const payload = {
        model: this.model,
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
    } else {
      // Gemini stream
      const url = `${this.baseUrl}/models/${this.model}:streamGenerateContent?key=${this.apiKey}&alt=sse`
      const payload = toGeminiPayload(messages)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Gemini stream error: ${response.status}`)
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
          try {
            const parsed = JSON.parse(data)
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) onChunk(text)
          } catch {}
        }
      }
    }
  }
}

export const nvidiaAI = new NvidiaAIService()
