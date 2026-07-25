import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { technologyService } from '@/services/technologyService'
import { MaterialIcon } from '@/components/common/MaterialIcon'

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-error)',
}

export function TechnologyDetailPage() {
  const { technology: slug } = useParams<{ technology: string }>()

  const { data: tech, isLoading } = useQuery({
    queryKey: ['technology', slug],
    queryFn: () => technologyService.getBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  if (!tech) return (
    <div className="px-6 py-20 max-w-3xl mx-auto text-center">
      <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: 'var(--color-border-muted)' }}>error</span>
      <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Technology not found</p>
      <Link to="/library" className="text-sm" style={{ color: 'var(--color-primary)' }}>← Back to Library</Link>
    </div>
  )

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Link to="/library" className="flex items-center gap-1 text-sm mb-6 transition-colors hover:text-primary animate-fade-up"
            style={{ color: 'var(--color-outline)' }}>
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Tech Library
      </Link>

      <div className="bento-card ai-glow-border p-8 mb-8 flex flex-col sm:flex-row items-start gap-6 animate-fade-up animation-delay-100 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: tech.color }} />
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: `${tech.color}18` }}>
          <MaterialIcon name={tech.icon} className="text-4xl" style={{ color: tech.color }} />
        </div>
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
              {tech.category}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>{tech.name}</h1>
          <p className="text-sm max-w-xl mb-5" style={{ color: 'var(--color-on-surface-variant)' }}>{tech.description}</p>
          <div className="flex items-center gap-5">
            <span className="text-sm" style={{ color: 'var(--color-outline)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{tech.topics.length}</span> topics · <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{tech.completedTopics}</span> completed
            </span>
            <Link to={`/topics/${tech.topics[0]?.slug}`}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Start Learning <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            </Link>
          </div>
        </div>
      </div>

      <h2 className="font-bold text-xs uppercase tracking-widest mb-4 animate-fade-up animation-delay-200" style={{ color: 'var(--color-outline)' }}>
        All Topics ({tech.topics.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up animation-delay-200">
        {tech.topics.map((t, i) => (
          <Link key={t.slug} to={`/topics/${t.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl transition-all group hover:border-primary"
                style={{ border: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-lowest)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                 style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-on-surface)' }}>{t.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold uppercase" style={{ color: LEVEL_COLOR[t.difficulty] || 'var(--color-outline)' }}>{t.difficulty}</span>
                {t.completed && <span className="text-[10px]" style={{ color: 'var(--color-success)' }}>✓ Completed</span>}
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1 flex-shrink-0"
                  style={{ color: 'var(--color-outline)' }}>arrow_forward</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
