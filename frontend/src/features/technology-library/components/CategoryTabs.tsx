import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  categories: string[]
  active: string
  onSelect: (category: string) => void
}

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  other: 'Other',
}

export function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          active === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors',
            active === cat
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {categoryLabels[cat] || cat}
        </button>
      ))}
    </div>
  )
}
