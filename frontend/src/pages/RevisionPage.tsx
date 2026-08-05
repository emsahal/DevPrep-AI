import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { revisionService } from '@/services/revisionService'

export function RevisionPage() {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['revision', 'topics'],
    queryFn: () => revisionService.getTopics(),
  })

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-5xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  const upcoming = topics.slice(0, 3)
  const mastered = topics.filter(t => t.difficulty === 'beginner').slice(0, 2)

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>Revision Hub</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Scheduled revisions powered by spaced-repetition to maximise long-term retention.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 animate-fade-up animation-delay-100">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-outline)' }}>Available Topics</h2>
          <div className="space-y-3">
            {upcoming.map((s, i) => (
              <div key={s.id || i} className="bento-card flex items-center gap-4 p-4 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--color-primary)/10' }}>
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>event_repeat</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>{s.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>
                    {s.technology?.name ?? 'General'} · {s.difficulty}
                  </p>
                </div>
                <Link to={`/topics/${s.slug}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Revise
                </Link>
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: 'var(--color-outline)' }}>No topics available for revision yet.</p>
            )}
          </div>

          <h2 className="text-xs font-bold uppercase tracking-widest mb-4 mt-8" style={{ color: 'var(--color-outline)' }}>Quick Access</h2>
          <div className="space-y-3">
            {mastered.map((m, i) => (
              <div key={m.id || i} className="bento-card flex items-center gap-4 p-4">
                <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="flex-1 font-semibold text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{m.title}</p>
                <span className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>Beginner</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4 animate-fade-up animation-delay-200">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(208,188,255,0.06)', border: '1px solid rgba(208,188,255,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>AI Suggestion</span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              Revise <strong style={{ color: 'var(--color-on-surface)' }}>JavaScript Closures</strong> today — 15 mins of revision can lock it in for 3+ weeks.
            </p>
            <Link to="/topics/functions-scope"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Revise Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="bento-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-outline)' }}>Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Topics Available', value: `${topics.length}` },
                { label: 'Beginner Topics', value: `${topics.filter(t => t.difficulty === 'beginner').length}` },
                { label: 'Advanced Topics', value: `${topics.filter(t => t.difficulty === 'advanced').length}` },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>{s.label}</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}