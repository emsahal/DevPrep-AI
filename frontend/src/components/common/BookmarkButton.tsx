import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookmarkService, type BookmarkItem } from '@/services/bookmarkService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/providers/ToastProvider'

interface BookmarkButtonProps {
  type: 'topic' | 'note' | 'flashcard'
  itemId: string
  size?: 'sm' | 'md'
  className?: string
}

export function BookmarkButton({ type, itemId, size = 'sm', className = '' }: BookmarkButtonProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Pre-populate the bookmarks cache so we know initial state. The button's own
  // presence drives this fetch — once any page with a BookmarkButton mounts,
  // BookmarksPage will also pick up the same data via the shared cache key.
  const { data: bookmarks = [] } = useQuery<BookmarkItem[]>({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkService.getAll(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  })

  const initialBookmarked = bookmarks.some(
    b => b.type === type && b.item?.id === itemId,
  )

  const [bookmarked, setBookmarked] = useState(initialBookmarked)

  // Keep local state in sync once the cache hydrates (so the icon isn't wrong
  // after the first fetch resolves).
  useEffect(() => {
    setBookmarked(initialBookmarked)
  }, [initialBookmarked])

  const toggleMutation = useMutation({
    mutationFn: () => bookmarkService.toggle(type, itemId),
    onMutate: async () => {
      // Optimistic flip
      const next = !bookmarked
      setBookmarked(next)
      return { previous: bookmarked }
    },
    onError: (_err, _vars, ctx) => {
      // Revert on failure
      if (ctx) setBookmarked(ctx.previous)
      toast({
        type: 'error',
        title: 'Couldn’t update bookmark',
        message: 'Please try again.',
      })
    },
    onSuccess: (data) => {
      // Server is the source of truth — sync with its response.
      setBookmarked(data.bookmarked)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      toast({
        type: 'success',
        title: data.bookmarked ? 'Saved' : 'Removed from saved',
      })
    },
  })

  if (!isAuthenticated) return null

  const iconSize = size === 'md' ? 'text-[18px]' : 'text-[15px]'
  const padding = size === 'md' ? 'px-3 py-2' : 'px-3 py-1.5'

  return (
    <button
      type="button"
      onClick={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
      title={bookmarked ? 'Remove from saved' : 'Save for later'}
      aria-label={bookmarked ? 'Remove from saved' : 'Save for later'}
      aria-pressed={bookmarked}
      className={`inline-flex items-center gap-1.5 rounded-full ${padding} text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 ${className}`}
      style={{
        background: bookmarked
          ? 'rgba(208,188,255,0.12)'
          : 'var(--color-surface-container)',
        border: `1px solid ${bookmarked ? 'rgba(208,188,255,0.35)' : 'var(--color-border-muted)'}`,
        color: bookmarked ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
      }}
    >
      <span
        className={`material-symbols-outlined ${iconSize}`}
        style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
      >
        {bookmarked ? 'bookmark' : 'bookmark_border'}
      </span>
      <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
    </button>
  )
}
