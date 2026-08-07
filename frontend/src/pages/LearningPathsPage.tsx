import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { learningPathService } from '@/services/learningPathService'
import { MaterialIcon } from '@/components/common/MaterialIcon'
import { TechLogo } from '@/components/common/TechLogo'
import { SEOHead } from '@/components/common/SEOHead'

const COLORS = [
  'var(--color-primary)', 'var(--color-secondary)', 'var(--color-tertiary)',
  'var(--color-success)',  'var(--color-warning)',   'var(--color-error)',
  '#8B5CF6', '#EC4899',
]

export function LearningPathsPage() {
  const { data: paths, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => learningPathService.getAll(),
  })

  return (
    <>
      <SEOHead
        title="Developer Roadmaps & CS Learning Paths"
        description="Structured, step-by-step developer learning roadmaps for Frontend, Backend, Full-Stack, Database Systems, DevOps, System Design, and DSA."
      />
      <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-10 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
          Learning Roadmaps
        </h1>
        <p className="text-sm max-w-xl" style={{ color: 'var(--color-on-surface-variant)' }}>
          {isLoading ? 'Loading...' : `${paths?.length ?? 0} curated paths to go from zero to job-ready.`}
        </p>
      </div>

      <div className="rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up animation-delay-100"
           style={{ background: 'rgba(208,188,255,0.06)', border: '1px solid rgba(208,188,255,0.2)' }}>
        <span className="material-symbols-outlined text-3xl flex-shrink-0" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-primary)' }}>AI Recommendation</p>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Based on your progress, we suggest continuing with <strong style={{ color: 'var(--color-on-surface)' }}>JavaScript → Advanced</strong> before moving to React.
          </p>
        </div>
        <Link to="/library/javascript"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
          Continue <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {paths?.map((path, i) => {
            const accentColor = COLORS[i % COLORS.length]
            return (
              <div key={path.id} className="bento-card ai-glow-border group p-6 flex flex-col gap-4 animate-fade-up"
                   style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: `${accentColor}15` }}>
                    <MaterialIcon name={path.icon} className="text-2xl" style={{ color: accentColor, fontVariationSettings: "'FILL' 0" }} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight" style={{ color: 'var(--color-on-surface)' }}>{path.title}</h2>
                    <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
                      {path.technologyCount} technologies · {path.topicCount} topics
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {path.technologies.map(tech => (
                    <Link key={tech.id} to={`/library/${tech.slug}`}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                          style={{ background: `${tech.color}15`, color: tech.slug === 'nextjs' ? '#ffffff' : tech.color, border: `1px solid ${tech.color}25` }}>
                      <TechLogo slug={tech.slug} icon={tech.icon} color={tech.slug === 'nextjs' ? '#ffffff' : tech.color} size={14} />
                      {tech.name}
                      <span className="ml-1 opacity-60">{tech.topicCount}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-2" style={{ borderTop: '1px solid var(--color-border-muted)' }}>
                  <Link to={`/learning-paths/${path.slug}`}
                        className="flex items-center justify-between text-sm font-semibold transition-colors group-hover:text-primary"
                        style={{ color: 'var(--color-on-surface-variant)' }}>
                    Start {path.title}
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
    </>
  )
}
