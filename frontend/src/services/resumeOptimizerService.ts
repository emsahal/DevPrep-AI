import api, { apiBaseUrl } from '@/lib/axios'
import type { ResumeUploadResult, CreditInfo, PricingPlan, CoverLetterData } from '@/types'

export interface GenerateStreamHandlers {
  onToken: (phase: 'analyze' | 'optimize' | 'cover-letter', text: string) => void
  onComplete: (result: {
    analysis: any
    optimize: { optimizedData: any; optimizedContent: string }
    coverLetter: CoverLetterData
    credits: CreditInfo
  }) => void
  onError: (message: string) => void
}

export const resumeOptimizerService = {
  async getCredits(): Promise<CreditInfo> {
    const { data } = await api.get('/resume-optimizer/credits')
    return data
  },

  async purchaseCredits(amount: number): Promise<void> {
    await api.post('/resume-optimizer/credits/purchase', { amount })
  },

  async uploadResume(file: File): Promise<ResumeUploadResult> {
    const formData = new FormData()
    formData.append('resume', file)
    const { data } = await api.post('/resume-optimizer/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async analyzeJob(resumeId: string, jobDescription: string): Promise<{ jobAnalysis: any; gapAnalysis: any }> {
    const { data } = await api.post('/resume-optimizer/analyze-job', { resumeId, jobDescription })
    return data
  },

  async streamGenerate(
    resumeId: string,
    jobDescription: string,
    handlers: GenerateStreamHandlers
  ): Promise<void> {
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${apiBaseUrl}/resume-optimizer/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ resumeId, jobDescription }),
    })

    if (!res.ok || !res.body) {
      throw new Error('Failed to start resume generation')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() || ''

      for (const block of blocks) {
        for (const line of block.split('\n')) {
          const clean = line.trim()
          if (!clean.startsWith('data: ')) continue
          const raw = clean.slice(6).trim()
          if (!raw) continue
          try {
            const payload = JSON.parse(raw)
            if (payload.type === 'token') {
              handlers.onToken(payload.phase, payload.text)
            } else if (payload.type === 'done') {
              handlers.onComplete({
                analysis: payload.analysis,
                optimize: payload.optimize,
                coverLetter: payload.coverLetter,
                credits: payload.credits,
              })
              return
            } else if (payload.type === 'error') {
              handlers.onError(payload.message || 'Generation failed')
              return
            }
          } catch { /* ignore malformed line */ }
        }
      }
    }
  },

  async optimizeResume(resumeId: string): Promise<{ optimizedData: any; optimizedContent: string }> {
    const { data } = await api.post('/resume-optimizer/optimize', { resumeId })
    return data
  },

  async generateCoverLetter(resumeId: string, companyName?: string, jobTitle?: string): Promise<CoverLetterData> {
    const { data } = await api.post('/resume-optimizer/cover-letter', { resumeId, companyName, jobTitle })
    return data
  },

  async getResume(id: string): Promise<any> {
    const { data } = await api.get(`/resume-optimizer/resumes/${id}`)
    return data
  },

  async getUserResumes(): Promise<any[]> {
    const { data } = await api.get('/resume-optimizer/resumes')
    return data
  },

  async deleteResume(id: string): Promise<void> {
    await api.delete(`/resume-optimizer/resumes/${id}`)
  },

  async getPricing(): Promise<PricingPlan> {
    const { data } = await api.get('/resume-optimizer/pricing')
    return data
  },

  async downloadOriginal(resumeId: string, filename: string): Promise<void> {
    const { data } = await api.get(`/resume-optimizer/resumes/${resumeId}/download`, {
      responseType: 'blob',
    })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  async downloadPdf(resumeId: string, font?: string): Promise<Blob> {
    const { data } = await api.get(`/resume-optimizer/resumes/${resumeId}/pdf`, {
      params: { font },
      responseType: 'blob',
    })
    return data
  },
}
