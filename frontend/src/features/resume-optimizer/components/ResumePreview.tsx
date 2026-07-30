import { useResumeOptimizerStore } from '@/store/resumeOptimizerStore'
import type { ResumeTemplate } from '@/types'

const TEMPLATES: { id: ResumeTemplate; name: string; description: string }[] = [
  { id: 'classic', name: 'Classic', description: 'Traditional layout for any industry' },
  { id: 'modern', name: 'Modern', description: 'Clean & contemporary design' },
  { id: 'ats-professional', name: 'ATS Professional', description: 'Optimized for ATS parsing' },
  { id: 'executive', name: 'Executive', description: 'For senior & leadership roles' },
  { id: 'minimal', name: 'Minimal', description: 'Simple & elegant' },
]

function ClassicPreview({ data }: { data: any }) {
  return (
    <div className="p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold" style={{ color: '#1F3864' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-xs mt-1" style={{ color: '#333' }}>
          {[data?.personalInfo?.phone, data?.personalInfo?.email].filter(Boolean).join(' | ')}
        </p>
      </div>

      <hr className="mb-4" style={{ borderColor: '#1F3864' }} />

      {data?.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: '#1F3864' }}>Professional Summary</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#333' }}>{data.summary}</p>
        </div>
      )}

      {data?.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: '#1F3864' }}>Experience</h2>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold" style={{ color: '#333' }}>{exp.company}</p>
                <p className="text-xs" style={{ color: '#555' }}>{exp.dateRange}</p>
              </div>
              <p className="text-xs italic" style={{ color: '#555' }}>{exp.role} · {exp.location}</p>
              <ul className="list-disc pl-4 mt-1">
                {(exp.bullets || []).map((b: string, j: number) => (
                  <li key={j} className="text-xs leading-relaxed" style={{ color: '#333' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data?.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: '#1F3864' }}>Projects</h2>
          {data.projects.map((proj: any, i: number) => (
            <div key={i} className="mb-2">
              <p className="text-xs font-bold" style={{ color: '#333' }}>{proj.name}</p>
              <ul className="list-disc pl-4 mt-0.5">
                {(proj.bullets || []).map((b: string, j: number) => (
                  <li key={j} className="text-xs leading-relaxed" style={{ color: '#333' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data?.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: '#1F3864' }}>Education</h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between items-center mb-1">
              <div>
                <p className="text-xs font-bold" style={{ color: '#333' }}>{edu.institution}</p>
                <p className="text-xs italic" style={{ color: '#555' }}>{edu.degree}</p>
              </div>
              <p className="text-xs" style={{ color: '#555' }}>{edu.dateRange}</p>
            </div>
          ))}
        </div>
      )}

      {data?.skills && data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: '#1F3864' }}>Skills</h2>
          {data.skills.map((sk: any, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#333' }}>
              <span className="font-bold">{sk.category}: </span>{sk.items?.join(', ')}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function ModernPreview({ data }: { data: any }) {
  return (
    <div className="p-8" style={{ fontFamily: 'Geist, sans-serif' }}>
      <div className="flex items-start gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold" style={{ color: '#1F3864' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
          <p className="text-xs mt-1" style={{ color: '#666' }}>
            {[data?.personalInfo?.phone, data?.personalInfo?.email].filter(Boolean).join(' · ')}
          </p>
          <p className="text-xs" style={{ color: '#666' }}>{[data?.personalInfo?.location, data?.personalInfo?.linkedin].filter(Boolean).join(' · ')}</p>
        </div>
      </div>

      {data?.summary && (
        <div className="mb-5 p-4 rounded-lg" style={{ background: '#F8F6FF' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#333' }}>{data.summary}</p>
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-[2]">
          {data?.experience && data.experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold mb-2" style={{ color: '#1F3864' }}>Experience</h2>
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#333' }}>{exp.role}</p>
                      <p className="text-xs" style={{ color: '#1F3864' }}>{exp.company} · {exp.location}</p>
                    </div>
                    <p className="text-xs whitespace-nowrap ml-4" style={{ color: '#888' }}>{exp.dateRange}</p>
                  </div>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    {(exp.bullets || []).map((b: string, j: number) => (
                      <li key={j} className="text-xs leading-relaxed" style={{ color: '#444' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {data?.projects && data.projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold mb-2" style={{ color: '#1F3864' }}>Projects</h2>
              {data.projects.map((proj: any, i: number) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-bold" style={{ color: '#333' }}>{proj.name}</p>
                  <ul className="list-disc pl-4 mt-0.5">
                    {(proj.bullets || []).map((b: string, j: number) => (
                      <li key={j} className="text-xs leading-relaxed" style={{ color: '#444' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1">
          {data?.education && data.education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold mb-2" style={{ color: '#1F3864' }}>Education</h2>
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-bold" style={{ color: '#333' }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: '#666' }}>{edu.degree} · {edu.dateRange}</p>
                </div>
              ))}
            </div>
          )}

          {data?.skills && data.skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold mb-2" style={{ color: '#1F3864' }}>Skills</h2>
              {data.skills.map((sk: any, i: number) => (
                <div key={i} className="mb-1.5">
                  <p className="text-xs font-bold" style={{ color: '#555' }}>{sk.category}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(sk.items || []).map((item: string, j: number) => (
                      <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ background: '#EDE9FE', color: '#6D3BD7' }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MinimalPreview({ data }: { data: any }) {
  return (
    <div className="p-8" style={{ fontFamily: 'Geist, sans-serif' }}>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold" style={{ color: '#111' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-xs mt-1" style={{ color: '#888' }}>
          {[data?.personalInfo?.email, data?.personalInfo?.phone].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className="space-y-5">
        {data?.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#999' }}>About</h2>
            <p className="text-xs leading-relaxed" style={{ color: '#333' }}>{data.summary}</p>
          </div>
        )}

        {data?.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#999' }}>Experience</h2>
            <div className="space-y-3">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <p className="text-xs font-bold" style={{ color: '#333' }}>{exp.company}</p>
                    <p className="text-xs" style={{ color: '#aaa' }}>{exp.dateRange}</p>
                  </div>
                  <p className="text-xs italic" style={{ color: '#888' }}>{exp.role}</p>
                  <ul className="list-disc pl-4 mt-0.5">
                    {(exp.bullets || []).map((b: string, j: number) => (
                      <li key={j} className="text-xs" style={{ color: '#555' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#999' }}>Education</h2>
            {data.education.map((edu: any, i: number) => (
              <div key={i}>
                <p className="text-xs font-bold" style={{ color: '#333' }}>{edu.institution}</p>
                <p className="text-xs" style={{ color: '#888' }}>{edu.degree} · {edu.dateRange}</p>
              </div>
            ))}
          </div>
        )}

        {data?.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#999' }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.flatMap((sk: any) => sk.items || []).map((item: string, i: number) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F5F5', color: '#555' }}>{item}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ExecutivePreview({ data }: { data: any }) {
  return (
    <div className="p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #1F3864' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1F3864' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-xs mt-1" style={{ color: '#555' }}>
          {[data?.personalInfo?.phone, data?.personalInfo?.email, data?.personalInfo?.linkedin].filter(Boolean).join(' · ')}
        </p>
        {data?.personalInfo?.location && (
          <p className="text-xs" style={{ color: '#888' }}>{data.personalInfo.location}</p>
        )}
      </div>

      {data?.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#1F3864' }}>Executive Summary</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#333' }}>{data.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#1F3864' }}>Core Skills</h2>
          {data?.skills?.slice(0, 2).map((sk: any, i: number) => (
            <div key={i} className="mb-1">
              <p className="text-xs font-bold" style={{ color: '#555' }}>{sk.category}</p>
              {(sk.items || []).slice(0, 4).map((item: string, j: number) => (
                <p key={j} className="text-xs" style={{ color: '#666' }}>· {item}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="col-span-2">
          {data?.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#1F3864' }}>Experience</h2>
              {data.experience.slice(0, 3).map((exp: any, i: number) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between">
                    <p className="text-xs font-bold" style={{ color: '#333' }}>{exp.company}</p>
                    <p className="text-xs" style={{ color: '#888' }}>{exp.dateRange}</p>
                  </div>
                  <p className="text-xs italic" style={{ color: '#555' }}>{exp.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {data?.education && data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#1F3864' }}>Education</h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between mb-1">
              <p className="text-xs font-bold" style={{ color: '#333' }}>{edu.institution}</p>
              <p className="text-xs" style={{ color: '#888' }}>{edu.degree} · {edu.dateRange}</p>
            </div>
          ))}
        </div>
      )}

      {data?.certifications && data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#1F3864' }}>Certifications</h2>
          {data.certifications.map((cert: string, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#555' }}>· {cert}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function ATSProfessionalPreview({ data }: { data: any }) {
  return (
    <div className="p-6" style={{ fontFamily: 'Times New Roman, serif', maxWidth: 720, margin: '0 auto' }}>
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold" style={{ color: '#000' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
        <p className="text-xs" style={{ color: '#333' }}>
          {[data?.personalInfo?.phone, data?.personalInfo?.email, data?.personalInfo?.linkedin].filter(Boolean).join(' | ')}
        </p>
      </div>

      <hr className="mb-3" />

      {data?.summary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1">Professional Summary</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#333' }}>{data.summary}</p>
        </div>
      )}

      {data?.technicalSkills && data.technicalSkills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1">Technical Skills</h2>
          <p className="text-xs" style={{ color: '#333' }}>{data.technicalSkills.join(' · ')}</p>
        </div>
      )}

      {data?.skills && data.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1">Skills</h2>
          {data.skills.map((sk: any, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#333' }}>
              <span className="font-bold">{sk.category}: </span>{sk.items?.join(', ')}
            </p>
          ))}
        </div>
      )}

      {data?.experience && data.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1">Experience</h2>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <p className="text-xs font-bold" style={{ color: '#000' }}>{exp.company} — {exp.role}</p>
                <p className="text-xs" style={{ color: '#555' }}>{exp.dateRange}</p>
              </div>
              <ul className="list-disc pl-4 mt-0.5">
                {(exp.bullets || []).map((b: string, j: number) => (
                  <li key={j} className="text-xs leading-relaxed" style={{ color: '#333' }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data?.education && data.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1">Education</h2>
          {data.education.map((edu: any, i: number) => (
            <div key={i} className="flex justify-between mb-0.5">
              <p className="text-xs" style={{ color: '#333' }}><span className="font-bold">{edu.institution}</span> — {edu.degree}</p>
              <p className="text-xs" style={{ color: '#555' }}>{edu.dateRange}</p>
            </div>
          ))}
        </div>
      )}

      {data?.certifications && data.certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase mb-1">Certifications</h2>
          {data.certifications.map((cert: string, i: number) => (
            <p key={i} className="text-xs" style={{ color: '#333' }}>· {cert}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export function ResumePreview() {
  const selectedTemplate = useResumeOptimizerStore(s => s.selectedTemplate)
  const optimizedResume = useResumeOptimizerStore(s => s.optimizedResume)
  const uploadResult = useResumeOptimizerStore(s => s.uploadResult)
  const setSelectedTemplate = useResumeOptimizerStore(s => s.setSelectedTemplate)

  const data = optimizedResume || uploadResult?.parsedData

  const renderPreview = () => {
    switch (selectedTemplate) {
      case 'classic': return <ClassicPreview data={data} />
      case 'modern': return <ModernPreview data={data} />
      case 'minimal': return <MinimalPreview data={data} />
      case 'executive': return <ExecutivePreview data={data} />
      case 'ats-professional': return <ATSProfessionalPreview data={data} />
      default: return <ClassicPreview data={data} />
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap border-none cursor-pointer"
            style={{
              background: selectedTemplate === t.id ? 'var(--color-primary)' : 'var(--color-surface-container)',
              color: selectedTemplate === t.id ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{
        background: '#FFFFFF',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        minHeight: 400,
      }}>
        {renderPreview()}
      </div>
    </div>
  )
}
