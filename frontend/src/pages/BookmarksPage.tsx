import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { bookmarkService } from '@/services/bookmarkService'

export function BookmarksPage() {
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookmarkService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  })

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-4xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>Saved Resources</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Your bookmarked topics, roadmaps, and quizzes.</p>
      </div>

      <div className="space-y-3 animate-fade-up animation-delay-100">
        {items.length === 0 ? (
          <div className="bento-card p-16 text-center">
            <span className="material-symbols-outlined text-5xl block mb-3" style={{ color: 'var(--color-border-muted)' }}>bookmark_border</span>
            <p style={{ color: 'var(--color-outline)' }}>No bookmarks yet. Save topics to review them later.</p>
          </div>
        ) : (
          items.map(item => {
            const slug = item.type === 'topic' ? `/topics/${item.item?.slug}` : '/'
            return (
              <div key={item.id} className="bento-card group flex items-center gap-4 p-4">
                <span className="material-symbols-outlined text-2xl flex-shrink-0"
                      style={{ color: item.type === 'topic' ? 'var(--color-primary)' : 'var(--color-secondary)', fontVariationSettings: "'FILL' 0" }}>
                  {item.type === 'topic' ? 'article' : 'event_note'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-on-surface)' }}>{item.item?.title ?? 'Untitled'}</p>
                  <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-outline)' }}>{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {slug && (
                    <Link to={slug}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                      Open
                    </Link>
                  )}
                  <button onClick={() => deleteMutation.mutate(item.id)}
                          className="p-1.5 rounded-lg transition-colors hover:text-error"
                          style={{ color: 'var(--color-outline)' }}>
                    <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}