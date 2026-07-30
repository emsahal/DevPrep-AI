import { useState } from 'react'
import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'

export function CoverLetterPreview() {
  const coverLetter = useResumeOptimizerStore(s => s.coverLetter)
  const jobAnalysis = useResumeOptimizerStore(s => s.jobAnalysis)
  const uploadResult = useResumeOptimizerStore(s => s.uploadResult)
  const [copied, setCopied] = useState(false)

  if (!coverLetter) return null

  const userName = uploadResult?.parsedData?.personalInfo?.name || coverLetter.signature || 'Candidate'
  const displayCompany = jobAnalysis?.companyName || 'Hiring Manager'

  const fullText = coverLetter.fullLetter || [
    coverLetter.greeting || `Dear ${displayCompany},`,
    '',
    coverLetter.introduction || '',
    '',
    ...(coverLetter.bodyParagraphs || []),
    '',
    coverLetter.closing || '',
    '',
    coverLetter.signature || userName,
  ].filter(Boolean).join('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: '#FFFFFF',
      border: '1px solid var(--color-border-subtle)',
      fontFamily: 'Times New Roman, serif',
      maxWidth: 640, margin: '0 auto',
    }}>
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid #eee' }}>
        <p className="text-xs font-medium" style={{ color: '#666' }}>Cover Letter</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border-none cursor-pointer transition-all"
          style={{
            background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(208,188,255,0.1)',
            color: copied ? 'var(--color-success)' : 'var(--color-primary)',
          }}
        >
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-6 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#333', fontFamily: 'Times New Roman, serif', lineHeight: 1.7 }}>
        {fullText}
      </div>
    </div>
  )
}