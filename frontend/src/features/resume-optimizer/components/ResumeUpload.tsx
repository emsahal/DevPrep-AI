import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { resumeOptimizerService } from '@/services/resumeOptimizerService'
import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'

export function ResumeUpload() {
  const [dragActive, setDragActive] = useState(false)
  const setUploadResult = useResumeOptimizerStore(s => s.setUploadResult)
  const setResumeId = useResumeOptimizerStore(s => s.setResumeId)
  const setStep = useResumeOptimizerStore(s => s.setStep)
  const setError = useResumeOptimizerStore(s => s.setError)
  const credits = useResumeOptimizerStore(s => s.credits)

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeOptimizerService.uploadResume(file),
    onSuccess: (data) => {
      setUploadResult(data)
      setResumeId(data.resumeId)
      setStep('job-description')
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to upload resume')
    },
  })

  const handleFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
      setError('Please upload a PDF or DOCX file')
      return
    }
    setError(null)
    uploadMutation.mutate(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-[26px] font-extrabold" style={{ fontFamily: 'var(--font-sans)' }}>Resume Optimizer</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-outline)' }}>
          Upload your resume and get ATS-optimized with a professional cover letter
        </p>
        {credits && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="pill" style={{ background: 'rgba(208,188,255,0.12)', color: 'var(--color-primary)' }}>
              {credits.available} credits left
            </span>
            <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
              · 1 credit per optimization
            </span>
          </div>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resume-upload-input')?.click()}
        className="relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200"
        style={{
          borderColor: dragActive ? 'var(--color-primary)' : 'var(--color-border-muted)',
          background: dragActive ? 'rgba(208,188,255,0.04)' : 'var(--color-surface-container-lowest)',
          maxWidth: 560, margin: '0 auto',
        }}
      >
        <input
          id="resume-upload-input"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(208,188,255,0.1)' }}>
            <span className="material-symbols-outlined text-[32px]" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
              description
            </span>
          </div>
          <div>
            <p className="text-base font-semibold" style={{ color: 'var(--color-on-surface)' }}>
              {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-outline)' }}>
              or <span style={{ color: 'var(--color-primary)' }}>browse files</span>
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>PDF</span>
            <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>DOCX</span>
          </div>
        </div>
      </div>

      {uploadMutation.isPending && (
        <div className="flex items-center justify-center gap-3 mt-8 p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', maxWidth: 560, margin: '24px auto 0' }}>
          <span className="material-symbols-outlined animate-spin text-[20px]" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
          <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Extracting content from your resume...</span>
        </div>
      )}
    </div>
  )
}
