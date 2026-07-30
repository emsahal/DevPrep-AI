import api from '@/lib/axios'
import type { ResumeUploadResult, CreditInfo, PricingPlan, CoverLetterData } from '@/types'

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
}
