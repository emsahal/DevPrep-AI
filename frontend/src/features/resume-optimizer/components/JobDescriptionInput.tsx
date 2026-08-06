import { useState, useRef } from 'react'
import { resumeOptimizerService } from '@/services/resumeOptimizerService'
import {
  ANALYSIS_STEPS,
  useResumeOptimizerStore,
  type AnalysisStepStatus,
} from '@/store/resumeOptimizerStore'

const PHASE_KEYS: Record<string, string> = {
  analyze: 'analyze',
  optimize: 'optimize',
  'cover-letter': 'cover-letter',
}

export function JobDescriptionInput() {
  const [text, setText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const lastPhaseRef = useRef<string>('')
  const resumeId = useResumeOptimizerStore(s => s.resumeId)
  const setStep = useResumeOptimizerStore(s => s.setStep)
  const setError = useResumeOptimizerStore(s => s.setError)
  const setProgressSteps = useResumeOptimizerStore(s => s.setProgressSteps)
  const setProgressStatus = useResumeOptimizerStore(s => s.setProgressStatus)
  const setLiveText = useResumeOptimizerStore(s => s.setLiveText)
  const uploadResult = useResumeOptimizerStore(s => s.uploadResult)

  const resetProgress = () => setProgressSteps(ANALYSIS_STEPS.map((s) => ({ ...s, status: 'pending' })))

  const markPhase = (phase: string, status: AnalysisStepStatus) => {
    const key = PHASE_KEYS[phase]
    if (key) setProgressStatus(key, status)
  }

  const handleGenerate = async () => {
    if (!resumeId || !text.trim() || isGenerating) return

    setIsGenerating(true)
    setError(null)
    lastPhaseRef.current = ''
    resetProgress()
    setLiveText(() => '')
    setStep('analyzing')

    try {
      await resumeOptimizerService.streamGenerate(resumeId, text, {
        onToken: (phase, liveContent) => {
          if (lastPhaseRef.current !== phase) {
            if (lastPhaseRef.current) markPhase(lastPhaseRef.current, 'done')
            markPhase(phase, 'active')
            lastPhaseRef.current = phase
          }
          setLiveText((prev) => {
            const next = prev + liveContent
            return next.length > 1400 ? next.slice(-1400) : next
          })
        },
        onComplete: (result) => {
          const store = useResumeOptimizerStore.getState()
          const originalParsed = store.uploadResult?.parsedData as Record<string, unknown> | undefined
          store.setJobAnalysis(result.analysis.jobAnalysis)
          store.setGapAnalysis(result.analysis.gapAnalysis)
          store.setJobDescription(text)
          store.setOptimizedResume({
            ...originalParsed,
            ...result.optimize.optimizedData,
            personalInfo: (originalParsed?.personalInfo as Record<string, string> | undefined) || {},
          })
          store.setCoverLetter(result.coverLetter)
          store.setCredits(result.credits)
          setProgressStatus('cover-letter', 'done')
          setProgressStatus('finalize', 'active')
          setLiveText(() => '')
          setTimeout(() => {
            setProgressStatus('finalize', 'done')
            setStep('results')
          }, 600)
        },
        onError: (message) => {
          const store = useResumeOptimizerStore.getState()
          const current = store.progressSteps.find((st) => st.status === 'active')
          if (current) store.setProgressStatus(current.key, 'error')
          setLiveText(() => '')
          setError(message)
        },
      })
    } catch {
      const store = useResumeOptimizerStore.getState()
      const current = store.progressSteps.find((st) => st.status === 'active')
      if (current) store.setProgressStatus(current.key, 'error')
      setLiveText(() => '')
      setError('Could not connect to the resume generator. Please try again.')
    } finally {
      setIsGenerating(false)
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
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all border-none cursor-pointer"
            style={{
              background: !text.trim() ? 'var(--color-surface-container-high)' : 'var(--color-primary)',
              color: !text.trim() ? 'var(--color-outline)' : 'var(--color-on-primary-fixed)',
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Starting...
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
