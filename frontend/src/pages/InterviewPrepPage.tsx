import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { interviewPrepService } from '@/services/interviewPrepService'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { SEOHead } from '@/components/common/SEOHead'

const TOPIC_ICONS: Record<string, string> = {
  HTML: 'code',
  CSS: 'palette',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  React: 'react',
  Next_js: 'next_js',
  State_Management: 'database',
  Node_js: 'node_js',
  Express_js: 'server',
  MongoDB: 'mongodb',
  PostgreSQL: 'postgresql',
  Authentication: 'lock',
  APIs: 'api',
  Git: 'git',
  Testing: 'test_tube',
  Performance: 'speed',
  Security: 'shield',
  DevOps: 'devops',
  System_Design: 'architecture',
  DSA: 'psychology',
  System_Design_Case_Scenarios: 'design_services',
}

const TOPIC_COLORS: Record<string, string> = {
  HTML: '#E44D26',
  CSS: '#1572B6',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  React: '#61DAFB',
  Next_js: '#000000',
  State_Management: '#764ABC',
  Node_js: '#339933',
  Express_js: '#000000',
  MongoDB: '#47A248',
  PostgreSQL: '#336791',
  Authentication: '#FF6B35',
  APIs: '#7B68EE',
  Git: '#F05032',
  Testing: '#E33332',
  Performance: '#00C853',
  Security: '#D32F2F',
  DevOps: '#1DA1F2',
  System_Design: '#6C63FF',
  DSA: '#FF6F00',
  System_Design_Case_Scenarios: '#6C63FF',
}

export function InterviewPrepPage() {
  const [query, setQuery] = useState('')

  const { data: topics, isLoading } = useQuery({
    queryKey: ['interview-prep'],
    queryFn: () => interviewPrepService.getTopics(),
  })

  const filtered = (topics ?? []).filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <SEOHead
        title="Technical Interview Preparation Questions & Answers"
        description="Comprehensive technical interview preparation with topic guides, code walkthroughs, conceptual explanations, and interview Q&A for software engineers."
      />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            Interview Prep
          </h1>
          <p className="text-sm max-w-xl" style={{ color: 'var(--color-on-surface-variant)' }}>
            {isLoading ? 'Loading...' : `${topics?.length ?? 0} topics with ${(topics ?? []).reduce((s, t) => s + t.questionCount, 0)}+ questions and code examples.`}
          </p>
        </div>

      <div className="glass-panel rounded-2xl px-4 py-3 mb-8 flex items-center gap-4 sticky top-[72px] z-30 animate-fade-up animation-delay-100">
        <div className="flex items-center gap-2 flex-1 min-w-0 rounded-xl px-3 py-2 ai-glow-focus"
             style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
          <input value={query} onChange={e => setQuery(e.target.value)}
                 type="text" placeholder="Search interview topics…"
                 className="bg-transparent border-none outline-none text-sm flex-1"
                 style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }} />
          {query && <button onClick={() => setQuery('')} className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>close</button>}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
        </div>
      ) : (
        <>
          <p className="text-xs mb-6 animate-fade-up animation-delay-200" style={{ color: 'var(--color-outline)' }}>
            Showing <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{filtered.length}</span> topics
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-up animation-delay-200">
            {filtered.map(topic => (
              <Link key={topic.slug} to={`/interview-prep/${topic.slug}`}
                    className="group bento-card tech-card-hover p-5 flex flex-col gap-4 no-underline">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                     style={{ background: `${(TOPIC_COLORS[topic.slug] || '#6C63FF')}18` }}>
                  <MaterialIcon name={TOPIC_ICONS[topic.slug] || 'quiz'} className="text-[26px]"
                    style={{ color: TOPIC_COLORS[topic.slug] || '#6C63FF', fontVariationSettings: "'FILL' 0" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--color-on-surface)' }}>{topic.name}</h3>
                  <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{topic.questionCount}</span> questions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider"
                        style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                    Interview
                  </span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-primary)' }}>arrow_forward</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>search_off</span>
                <p style={{ color: 'var(--color-outline)' }}>No topics found for "<span style={{ color: 'var(--color-primary)' }}>{query}</span>"</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
    </>
  )
}
