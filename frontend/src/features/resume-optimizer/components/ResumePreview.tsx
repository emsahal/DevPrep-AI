import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'

export function ResumePreview() {
  const optimizedResume = useResumeOptimizerStore(s => s.optimizedResume)
  const uploadResult = useResumeOptimizerStore(s => s.uploadResult)

  const data = optimizedResume || uploadResult?.parsedData

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12" style={{ background: '#fff', minHeight: 400 }}>
        <p className="text-sm" style={{ color: '#999' }}>No resume data available</p>
      </div>
    )
  }

  return (
    <div className="p-8" style={{ background: '#fff', minHeight: 400, color: '#000', lineHeight: 1.5 }}>
      {/* Personal Info */}
      {data.personalInfo?.name && (
        <div className="mb-6">
          <h1 className="text-xl font-bold" style={{ color: '#000' }}>{data.personalInfo.name}</h1>
          <p className="text-xs mt-1" style={{ color: '#444' }}>
            {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' · ')}
          </p>
          <p className="text-xs" style={{ color: '#444' }}>
            {[data.personalInfo.linkedin, data.personalInfo.github, data.personalInfo.portfolio].filter(Boolean).join(' · ')}
          </p>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div className="mb-5">
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#333' }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Experience</h2>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold" style={{ color: '#000' }}>{exp.company}</p>
                <p className="text-xs whitespace-nowrap ml-4" style={{ color: '#666' }}>{exp.dateRange}</p>
              </div>
              <p className="text-xs" style={{ color: '#444' }}>{exp.role}{exp.location ? ` · ${exp.location}` : ''}</p>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {(exp.bullets || []).map((b: string, j: number) => (
                  <li key={j} className="text-xs leading-relaxed" style={{ color: '#333' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Projects</h2>
          {data.projects.map((proj: any, i: number) => (
            <div key={i} className="mb-2">
              <p className="text-sm font-bold" style={{ color: '#000' }}>{proj.name}</p>
              <ul className="list-disc pl-5 mt-0.5">
                {(proj.bullets || []).map((b: string, j: number) => (
                  <li key={j} className="text-xs leading-relaxed" style={{ color: '#333' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Education</h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between items-start mb-1">
              <div>
                <p className="text-xs font-bold" style={{ color: '#000' }}>{edu.institution}</p>
                <p className="text-xs" style={{ color: '#444' }}>{edu.degree}{edu.location ? ` · ${edu.location}` : ''}</p>
              </div>
              <p className="text-xs whitespace-nowrap ml-4" style={{ color: '#666' }}>{edu.dateRange}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Skills</h2>
          {data.skills.map((sk: any, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#333' }}>
              <span className="font-bold">{sk.category}: </span>
              {(sk.items || []).join(', ')}
            </p>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {data.technicalSkills?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Technical Skills</h2>
          <p className="text-xs" style={{ color: '#333' }}>{data.technicalSkills.join(', ')}</p>
        </div>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Certifications</h2>
          {data.certifications.map((cert: string, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#333' }}>· {cert}</p>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#000', borderBottom: '1px solid #ddd', paddingBottom: 4 }}>Achievements</h2>
          {data.achievements.map((ach: string, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#333' }}>· {ach}</p>
          ))}
        </div>
      )}
    </div>
  )
}