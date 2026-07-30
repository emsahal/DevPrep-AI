import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { resumeOptimizerService } from '@/services/resumeOptimizerService'
import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'

export function JobDescriptionInput() {
  const [text, setText] = useState('')
  const resumeId = useResumeOptimizerStore(s => s.resumeId)
  const setJobAnalysis = useResumeOptimizerStore(s => s.setJobAnalysis)
  const setGapAnalysis = useResumeOptimizerStore(s => s.setGapAnalysis)
  const setJobDescription = useResumeOptimizerStore(s => s.setJobDescription)
  const setStep = useResumeOptimizerStore(s => s.setStep)
  const setError = useResumeOptimizerStore(s => s.setError)
  const uploadResult = useResumeOptimizerStore(s => s.uploadResult)

  const analyzeMutation = useMutation({
    mutationFn: () => resumeOptimizerService.analyzeJob(resumeId!, text),
    onSuccess: (data) => {
      setJobAnalysis(data.jobAnalysis)
      setGapAnalysis(data.gapAnalysis)
      setJobDescription(text)
      setStep('analyzing')
      runOptimization(resumeId!)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to analyze job description')
    },
  })

  const optimizeMutation = useMutation({
    mutationFn: (id: string) => resumeOptimizerService.optimizeResume(id),
  })

  const coverLetterMutation = useMutation({
    mutationFn: (params: { id: string; company?: string; title?: string }) =>
      resumeOptimizerService.generateCoverLetter(params.id, params.company, params.title),
  })

  const runOptimization = async (id: string) => {
    try {
      const optResult = await optimizeMutation.mutateAsync(id)
      const store = useResumeOptimizerStore.getState()
      const originalParsed = store.uploadResult?.parsedData || {}
      const merged = {
        ...originalParsed,
        ...optResult.optimizedData,
        personalInfo: originalParsed.personalInfo || {},
      }
      store.setOptimizedResume(merged)

      const jobAnalysis = useResumeOptimizerStore.getState().jobAnalysis
      const clResult = await coverLetterMutation.mutateAsync({
        id,
        company: jobAnalysis?.companyName,
        title: jobAnalysis?.jobTitle,
      })
      useResumeOptimizerStore.getState().setCoverLetter(clResult)
      useResumeOptimizerStore.getState().setCredits(
        await resumeOptimizerService.getCredits()
      )
      setStep('results')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Optimization failed')
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep('upload')}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Paste Job Description</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-outline)' }}>
          Paste the job description to analyze and optimize your resume
        </p>
      </div>

      {uploadResult && (
        <div className="flex items-center gap-3 p-3 rounded-xl mb-6"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', maxWidth: 680, margin: '0 auto 24px' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-success)' }}>check_circle</span>
          <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
            Resume uploaded: {uploadResult.parsedData?.personalInfo?.name || 'Resume'} · {uploadResult.parsedData?.experience?.length || 0} experiences · {uploadResult.parsedData?.skills?.length || 0} skill categories
          </span>
        </div>
      )}

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full min-h-[280px] p-4 rounded-xl text-sm resize-y custom-scrollbar"
          style={{
            background: 'var(--color-surface-container)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-on-surface)',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.7,
          }}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
            {text.length} characters
          </span>
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={!text.trim() || analyzeMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all border-none cursor-pointer"
            style={{
              background: !text.trim() ? 'var(--color-surface-container-high)' : 'var(--color-primary)',
              color: !text.trim() ? 'var(--color-outline)' : 'var(--color-on-primary-fixed)',
              opacity: analyzeMutation.isPending ? 0.7 : 1,
            }}
          >
            {analyzeMutation.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>rocket_launch</span>
                Optimize Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
