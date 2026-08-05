import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { technologyService } from '@/services/technologyService'
import { TechLogo } from '@/components/common/TechLogo'

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'Security', 'DevOps', 'System Design', 'DSA', 'Projects']

export function TechnologyLibraryPage() {
  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => technologyService.getAll(),
  })

  const technologies = data?.technologies ?? []
  const totalTopics = technologies.reduce((s, t) => s + t.topicCount, 0)

  const filtered = technologies.filter(t =>
    (active === 'All' || t.category === active) &&
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
          Tech Library
        </h1>
        <p className="text-sm max-w-xl" style={{ color: 'var(--color-on-surface-variant)' }}>
          {isLoading ? 'Loading...' : `${technologies.length} technologies · ${totalTopics}+ topics across the full software engineering stack.`}
        </p>
      </div>

      <div className="glass-panel rounded-2xl px-4 py-3 mb-8 flex flex-col sm:flex-row items-center gap-4 sticky top-[72px] z-30 animate-fade-up animation-delay-100">
        <div className="flex items-center gap-2 flex-1 min-w-0 rounded-xl px-3 py-2 ai-glow-focus"
             style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
          <input value={query} onChange={e => setQuery(e.target.value)}
                 type="text" placeholder="Search technologies…"
                 className="bg-transparent border-none outline-none text-sm flex-1"
                 style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }} />
          {query && <button onClick={() => setQuery('')} className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>close</button>}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActive(c)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{
                      background: active === c ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                      color:      active === c ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                      border:     active === c ? 'none' : '1px solid var(--color-border-muted)',
                    }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
        </div>
      ) : (
        <>
          <p className="text-xs mb-6 animate-fade-up animation-delay-200" style={{ color: 'var(--color-outline)' }}>
            Showing <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{filtered.length}</span> technologies
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-up animation-delay-200">
            {filtered.map(tech => (
              <Link key={tech.id} to={`/library/${tech.slug}`}
                    className="group bento-card tech-card-hover p-5 flex flex-col gap-4 no-underline">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                     style={{ background: `${tech.color}18` }}>
                  <TechLogo slug={tech.slug} icon={tech.icon} color={tech.color} size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--color-on-surface)' }}>{tech.name}</h3>
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--color-outline)' }}>{tech.description}</p>
                  <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{tech.topicCount}</span> topics
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider"
                        style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                    {tech.category}
                  </span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-primary)' }}>arrow_forward</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>search_off</span>
                <p style={{ color: 'var(--color-outline)' }}>No technologies found for "<span style={{ color: 'var(--color-primary)' }}>{query}</span>"</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
