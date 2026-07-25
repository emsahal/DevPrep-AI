import { cn } from '@/lib/utils'

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'definition', label: 'Definition' },
  { id: 'internal-working', label: 'Internal Working' },
  { id: 'syntax', label: 'Syntax' },
  { id: 'code-examples', label: 'Code Examples' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'common-mistakes', label: 'Common Mistakes' },
  { id: 'real-world-examples', label: 'Real-world Examples' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'revision-notes', label: 'Revision Notes' },
  { id: 'related-topics', label: 'Related Topics' },
  { id: 'references', label: 'References' },
]

interface TableOfContentsProps {
  activeSection: string
  onSectionClick: (id: string) => void
}

export function TableOfContents({ activeSection, onSectionClick }: TableOfContentsProps) {
  return (
    <nav className="sticky top-24 w-56 shrink-0">
      <h4 className="mb-3 text-sm font-semibold text-muted-foreground">On this page</h4>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onSectionClick(section.id)}
              className={cn(
                'w-full text-left text-sm transition-colors py-1 px-2 rounded-md',
                activeSection === section.id
                  ? 'bg-accent font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function getSectionId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
