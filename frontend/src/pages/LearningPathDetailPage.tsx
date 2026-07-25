import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { learningPathService } from '@/services/learningPathService'
import { MaterialIcon } from '@/components/common/MaterialIcon'

export function LearningPathDetailPage() {
  const { path: slug } = useParams<{ path: string }>()

  const { data: path, isLoading } = useQuery({
    queryKey: ['learning-path', slug],
    queryFn: () => learningPathService.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-5xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  if (!path) return (
    <div className="px-6 py-20 max-w-5xl mx-auto text-center">
      <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: 'var(--color-border-muted)' }}>error</span>
      <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Learning path not found</p>
      <Link to="/learning-paths" className="text-sm" style={{ color: 'var(--color-primary)' }}>← Back to Roadmaps</Link>
    </div>
  )

  const allTopics = path.technologies.flatMap(t => t.topics)
  const done = allTopics.filter(t => t.completed).length
  const pct = path.progress

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Link to="/learning-paths" className="flex items-center gap-1 text-sm mb-6 transition-colors hover:text-primary animate-fade-up"
            style={{ color: 'var(--color-outline)' }}>
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        All Roadmaps
      </Link>

      <div className="bento-card ai-glow-border p-8 mb-8 relative overflow-hidden animate-fade-up animation-delay-100">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: 'var(--color-primary)' }} />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="pill" style={{ background: 'rgba(76,215,246,0.12)', color: 'var(--color-secondary)', border: '1px solid rgba(76,215,246,0.25)' }}>{path.difficulty}</span>
            <span className="pill" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>{path.estimatedHours}h</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>{path.title}</h1>
          <p className="text-sm max-w-xl mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            {path.description}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between text-xs mb-2">
                <span style={{ color: 'var(--color-outline)' }}>Overall progress</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full" style={{ background: 'var(--color-surface-container-high)' }}>
                <div className="h-full rounded-full progress-glow" style={{ width: `${pct}%`, background: 'var(--color-primary)' }} />
              </div>
            </div>
            {allTopics[0] && (
              <Link to={`/topics/${allTopics[0].slug}`}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                Continue <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {path.technologies.map(tech => (
        <div key={tech.id} className="mb-8 animate-fade-up animation-delay-200">
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name={tech.icon} className="text-xl" style={{ color: tech.color }} />
            <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>{tech.name}</h2>
          </div>
          <div className="space-y-3">
            {tech.topics.map((t, i) => (
              <Link key={t.slug} to={`/topics/${t.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all group hover:border-primary"
                    style={{ border: `1px solid ${t.completed ? 'rgba(16,185,129,0.3)' : 'var(--color-border-subtle)'}`, background: t.completed ? 'rgba(16,185,129,0.04)' : 'var(--color-surface-container-lowest)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: t.completed ? 'var(--color-success)' : 'var(--color-surface-container-high)' }}>
                  {t.completed ? (
                    <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : (
                    <span className="text-xs font-bold" style={{ color: 'var(--color-outline)' }}>{i + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: t.completed ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)' }}>
                    {t.title}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1"
                      style={{ color: 'var(--color-outline)' }}>arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
