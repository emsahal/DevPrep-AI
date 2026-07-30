import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'
import { useResumeOptimizerStore as useStore } from '@/store/resumeOptimizerStore'

function ScoreCircle({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 42
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-surface-container-high)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 50 50)" strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fontSize="22" fontWeight="700" fill={color}>
          {value}%
        </text>
      </svg>
      <span className="text-xs font-medium text-center" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</span>
    </div>
  )
}

export function AnalysisDashboard() {
  const gapAnalysis = useResumeOptimizerStore(s => s.gapAnalysis)
  const jobAnalysis = useResumeOptimizerStore(s => s.jobAnalysis)
  const setStep = useStore(s => s.setStep)

  if (!gapAnalysis || !jobAnalysis) return null

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep('job-description')}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Analysis Results</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-outline)' }}>
          {jobAnalysis.companyName && `${jobAnalysis.companyName} · `}{jobAnalysis.jobTitle || 'Job'} · {jobAnalysis.seniorityLevel || 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <ScoreCircle value={gapAnalysis.atsScore} label="ATS Score" color="var(--color-primary)" />
        <ScoreCircle value={gapAnalysis.resumeMatchPercentage} label="Match Score" color="var(--color-secondary)" />
        <ScoreCircle value={gapAnalysis.keywordMatchPercentage} label="Keyword Match" color="var(--color-tertiary)" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>Matching Skills</h3>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.matchingSkills?.map((s, i) => (
              <span key={i} className="pill" style={{ background: 'rgba(16,185,129,0.1)', color: '#4ADE80' }}>{s}</span>
            ))}
            {(!gapAnalysis.matchingSkills || gapAnalysis.matchingSkills.length === 0) && (
              <span className="text-xs" style={{ color: 'var(--color-outline)' }}>No matching skills found</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.missingSkills?.map((s, i) => (
              <span key={i} className="pill" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>{s}</span>
            ))}
            {(!gapAnalysis.missingSkills || gapAnalysis.missingSkills.length === 0) && (
              <span className="text-xs" style={{ color: 'var(--color-outline)' }}>No missing skills identified</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl col-span-2" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>Section Analysis</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: '#4ADE80' }}>Strong Sections</p>
              <div className="flex flex-wrap gap-1.5">
                {gapAnalysis.strongSections?.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', color: '#4ADE80' }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: '#F87171' }}>Weak Sections</p>
              <div className="flex flex-wrap gap-1.5">
                {gapAnalysis.weakSections?.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>Improvement Suggestions</h3>
        <ul className="space-y-2">
          {gapAnalysis.improvementSuggestions?.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
              <span className="material-symbols-outlined text-[14px] mt-0.5" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {gapAnalysis.missingKeywords && gapAnalysis.missingKeywords.length > 0 && (
        <div className="p-4 rounded-xl mt-4" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {gapAnalysis.missingKeywords.map((k, i) => (
              <span key={i} className="pill" style={{ background: 'rgba(245,158,11,0.1)', color: '#FBBF24' }}>{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
