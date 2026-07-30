import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'

export function CoverLetterPreview() {
  const coverLetter = useResumeOptimizerStore(s => s.coverLetter)
  const jobAnalysis = useResumeOptimizerStore(s => s.jobAnalysis)

  if (!coverLetter) return null

  const displayCompany = jobAnalysis?.companyName || 'Hiring Manager'

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: '#FFFFFF',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      fontFamily: 'Times New Roman, serif',
      maxWidth: 640, margin: '0 auto',
    }}>
      <div className="p-8 text-sm" style={{ color: '#333', lineHeight: 1.7 }}>
        {coverLetter.fullLetter ? (
          coverLetter.fullLetter.split('\n').map((paragraph, i) => (
            paragraph.trim() ? (
              <p key={i} className="mb-3 leading-relaxed">{paragraph}</p>
            ) : <br key={i} />
          ))
        ) : (
          <>
            <p className="mb-4">{coverLetter.greeting || `Dear ${displayCompany},`}</p>
            {coverLetter.introduction && <p className="mb-3">{coverLetter.introduction}</p>}
            {(coverLetter.bodyParagraphs || []).map((p, i) => (
              <p key={i} className="mb-3">{p}</p>
            ))}
            {coverLetter.closing && <p className="mb-6">{coverLetter.closing}</p>}
            {coverLetter.signature && (
              <div>
                <p>{coverLetter.signature}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
