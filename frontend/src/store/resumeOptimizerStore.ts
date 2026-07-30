import { create } from 'zustand'
import type { ResumeUploadResult, GapAnalysis, JobAnalysis, OptimizedResume, CoverLetterData, ResumeTemplate, CreditInfo } from '@/types'

type Step = 'upload' | 'job-description' | 'analyzing' | 'results'

interface ResumeOptimizerState {
  step: Step
  resumeId: string | null
  uploadResult: ResumeUploadResult | null
  jobDescription: string
  jobAnalysis: JobAnalysis | null
  gapAnalysis: GapAnalysis | null
  optimizedResume: OptimizedResume | null
  coverLetter: CoverLetterData | null
  selectedTemplate: ResumeTemplate
  coverLetterTemplate: string
  credits: CreditInfo | null
  isLoading: boolean
  error: string | null

  setStep: (step: Step) => void
  setResumeId: (id: string) => void
  setUploadResult: (result: ResumeUploadResult) => void
  setJobDescription: (desc: string) => void
  setJobAnalysis: (analysis: JobAnalysis) => void
  setGapAnalysis: (analysis: GapAnalysis) => void
  setOptimizedResume: (resume: OptimizedResume) => void
  setCoverLetter: (letter: CoverLetterData) => void
  setSelectedTemplate: (template: ResumeTemplate) => void
  setCoverLetterTemplate: (template: string) => void
  setCredits: (credits: CreditInfo) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  step: 'upload' as Step,
  resumeId: null as string | null,
  uploadResult: null as ResumeUploadResult | null,
  jobDescription: '',
  jobAnalysis: null as JobAnalysis | null,
  gapAnalysis: null as GapAnalysis | null,
  optimizedResume: null as OptimizedResume | null,
  coverLetter: null as CoverLetterData | null,
  selectedTemplate: 'classic' as ResumeTemplate,
  coverLetterTemplate: 'modern',
  credits: null as CreditInfo | null,
  isLoading: false,
  error: null as string | null,
}

export const useResumeOptimizerStore = create<ResumeOptimizerState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setResumeId: (resumeId) => set({ resumeId }),
  setUploadResult: (uploadResult) => set({ uploadResult }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setJobAnalysis: (jobAnalysis) => set({ jobAnalysis }),
  setGapAnalysis: (gapAnalysis) => set({ gapAnalysis }),
  setOptimizedResume: (optimizedResume) => set({ optimizedResume }),
  setCoverLetter: (coverLetter) => set({ coverLetter }),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
  setCoverLetterTemplate: (coverLetterTemplate) => set({ coverLetterTemplate }),
  setCredits: (credits) => set({ credits }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState, credits: null }),
}))
