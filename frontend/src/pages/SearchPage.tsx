import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchService } from '@/services/searchService'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ slug: string; title: string; techName: string; techColor?: string; category?: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchService.search(query)
        setResults([
          ...data.topics.map(t => ({ slug: t.slug, title: t.title, techName: t.technology.name })),
          ...data.technologies.map(t => ({ slug: t.slug, title: t.name, techName: t.category })),
        ])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>Search</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Search across topics and technologies instantly.
        </p>
      </div>

      <div className="relative mb-8 ai-glow-focus animate-fade-up animation-delay-100 rounded-2xl"
           style={{ border: '1px solid var(--color-border-muted)', background: 'var(--color-surface-container-low)' }}>
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px]" style={{ color: 'var(--color-outline)' }}>search</span>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} type="text"
               placeholder="Search topics, technologies…"
               className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-12 text-base"
               style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }} />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px]"
                  style={{ color: 'var(--color-outline)' }}>close</button>
        )}
      </div>

      {query.trim().length < 2 ? (
        <div className="text-center py-12 animate-fade-up animation-delay-200">
          <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>manage_search</span>
          <p style={{ color: 'var(--color-outline)' }}>Type at least 2 characters to search.</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 animate-fade-up">
          <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>search_off</span>
          <p style={{ color: 'var(--color-outline)' }}>No results for "<span style={{ color: 'var(--color-primary)' }}>{query}</span>"</p>
        </div>
      ) : (
        <div className="space-y-2 animate-fade-up">
          <p className="text-xs mb-4" style={{ color: 'var(--color-outline)' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{results.length}</span> results
          </p>
          {results.map(r => (
            <Link key={r.slug} to={`/topics/${r.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all group hover:border-primary"
                  style={{ border: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-lowest)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(208,188,255,0.15)' }}>
                <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-primary)' }}>article</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate" style={{ color: 'var(--color-on-surface)' }}>
                  {r.title}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--color-outline)' }}>{r.techName}</p>
              </div>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1 flex-shrink-0"
                    style={{ color: 'var(--color-outline)' }}>arrow_forward</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}