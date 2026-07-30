import { useEffect, useState } from 'react'
import { ResumeUpload } from '@/features/resume-optimizer/components/ResumeUpload'
import { JobDescriptionInput } from '@/features/resume-optimizer/components/JobDescriptionInput'
import { AnalysisDashboard } from '@/features/resume-optimizer/components/AnalysisDashboard'
import { ResumePreview } from '@/features/resume-optimizer/components/ResumePreview'
import { CoverLetterPreview } from '@/features/resume-optimizer/components/CoverLetterPreview'
import { PricingModal } from '@/features/resume-optimizer/components/PricingModal'
import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'
import { resumeOptimizerService } from '@/services/resumeOptimizerService'
import { generateResumeDocx, generateCoverLetterDocx } from '@/features/resume-optimizer/utils/documentGenerator'

export function ResumeOptimizerPage() {
  const step = useResumeOptimizerStore(s => s.step)
  const gapAnalysis = useResumeOptimizerStore(s => s.gapAnalysis)
  const coverLetter = useResumeOptimizerStore(s => s.coverLetter)
  const uploadResult = useResumeOptimizerStore(s => s.uploadResult)
  const optimizedResume = useResumeOptimizerStore(s => s.optimizedResume)
  const error = useResumeOptimizerStore(s => s.error)
  const setError = useResumeOptimizerStore(s => s.setError)
  const setCredits = useResumeOptimizerStore(s => s.setCredits)
  const credits = useResumeOptimizerStore(s => s.credits)
  const reset = useResumeOptimizerStore(s => s.reset)
  const [showPricing, setShowPricing] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showCoverLetterPreview, setShowCoverLetterPreview] = useState(false)

  useEffect(() => {
    resumeOptimizerService.getCredits()
      .then(setCredits)
      .catch(() => {})
  }, [])

  const handleDownloadResume = async () => {
    setDownloading('resume')
    try {
      const data = optimizedResume || uploadResult?.parsedData
      if (!data) return
      const blob = await generateResumeDocx(data as any)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Optimized_Resume.docx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {}
    setDownloading(null)
  }

  const handleDownloadCoverLetter = async () => {
    setDownloading('cover-letter')
    try {
      if (!coverLetter?.fullLetter) return
      const name = uploadResult?.parsedData?.personalInfo?.name || 'Cover Letter'
      const blob = await generateCoverLetterDocx(coverLetter.fullLetter, name)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Cover_Letter.docx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {}
    setDownloading(null)
  }

  const handleStartNew = () => {
    reset()
    resumeOptimizerService.getCredits().then(setCredits).catch(() => {})
  }

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div style={{ padding: 32, maxWidth: 960, margin: '0 auto', width: '100%' }}>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {['upload', 'job-description', 'analyzing', 'results'].map((s, i) => {
              const currentIndex = ['upload', 'job-description', 'analyzing', 'results'].indexOf(step)
              const thisIndex = i
              const isActive = thisIndex === currentIndex
              const isDone = thisIndex < currentIndex
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: isDone ? 'var(--color-primary)' : isActive ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                      color: isDone || isActive ? 'var(--color-on-primary-fixed)' : 'var(--color-outline)',
                    }}>
                    {isDone ? (
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-xs font-medium" style={{
                    color: isActive ? 'var(--color-on-surface)' : 'var(--color-outline)',
                    display: i === 3 ? 'block' : 'none',
                  }}>
                    {['Upload', 'Job Description', 'Analysis', 'Results'][i]}
                  </span>
                  {i < 3 && <div className="w-8 h-px" style={{ background: isDone ? 'var(--color-primary)' : 'var(--color-border-muted)' }} />}
                </div>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-xs"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-error)' }}>
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
              <button onClick={() => setError(null)} className="ml-auto bg-none border-none cursor-pointer" style={{ color: 'var(--color-error)' }}>
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Main content */}
          {step === 'upload' && <ResumeUpload />}
          {step === 'job-description' && <JobDescriptionInput />}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="material-symbols-outlined animate-spin text-[40px]" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
              <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Optimizing your resume and generating cover letter...</p>
              <div className="w-64 h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-container-high)' }}>
                <div className="h-full rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', width: '60%' }} />
              </div>
            </div>
          )}

          {/* Results */}
          {step === 'results' && (
            <div className="space-y-8">
              {/* Score Cards */}
              {gapAnalysis && <AnalysisDashboard />}

              {/* Download & Preview Actions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(208,188,255,0.1)' }}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>description</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>Optimized Resume</p>
                      <p className="text-xs" style={{ color: 'var(--color-outline)' }}>ATS-friendly format</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowResumePreview(true)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold border cursor-pointer"
                      style={{ borderColor: 'var(--color-border-muted)', color: 'var(--color-on-surface-variant)', background: 'transparent' }}>
                      Preview
                    </button>
                    <button onClick={handleDownloadResume}
                      disabled={downloading === 'resume'}
                      className="flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer"
                      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                      {downloading === 'resume' ? (
                        <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                      ) : 'Download'}
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(76,215,246,0.1)' }}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-secondary)', fontVariationSettings: "'FILL' 1" }}>mail</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>Cover Letter</p>
                      <p className="text-xs" style={{ color: 'var(--color-outline)' }}>Personalized for the role</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCoverLetterPreview(true)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold border cursor-pointer"
                      style={{ borderColor: 'var(--color-border-muted)', color: 'var(--color-on-surface-variant)', background: 'transparent' }}>
                      Preview
                    </button>
                    <button onClick={handleDownloadCoverLetter}
                      disabled={downloading === 'cover-letter'}
                      className="flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer"
                      style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>
                      {downloading === 'cover-letter' ? (
                        <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                      ) : 'Download'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Start New */}
              <div className="flex justify-center">
                <button onClick={handleStartNew}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold border-none cursor-pointer transition-all"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span>
                  Optimize Another Resume
                </button>
              </div>
            </div>
          )}

          {/* Credits info + buy */}
          {credits && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-outline)' }}>
                <span className="material-symbols-outlined text-[16px]">monetization_on</span>
                {credits.available} credits remaining
              </div>
              <button onClick={() => setShowPricing(true)}
                className="text-xs font-bold px-4 py-1.5 rounded-lg border-none cursor-pointer"
                style={{ background: 'rgba(208,188,255,0.12)', color: 'var(--color-primary)' }}>
                Buy Credits
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />

      {/* Resume Preview Modal */}
      {showResumePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowResumePreview(false)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl custom-scrollbar"
            style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-border-subtle)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 pb-2" style={{ background: 'var(--color-surface-container-lowest)' }}>
              <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Resume Preview</h3>
              <button onClick={() => setShowResumePreview(false)}
                className="bg-none border-none cursor-pointer" style={{ color: 'var(--color-outline)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4">
              <ResumePreview />
            </div>
          </div>
        </div>
      )}

      {/* Cover Letter Preview Modal */}
      {showCoverLetterPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowCoverLetterPreview(false)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl custom-scrollbar"
            style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-border-subtle)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 pb-2" style={{ background: 'var(--color-surface-container-lowest)' }}>
              <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Cover Letter Preview</h3>
              <button onClick={() => setShowCoverLetterPreview(false)}
                className="bg-none border-none cursor-pointer" style={{ color: 'var(--color-outline)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4">
              <CoverLetterPreview />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
