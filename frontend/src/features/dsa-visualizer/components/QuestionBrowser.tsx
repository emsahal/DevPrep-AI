import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { allQuestions } from '@/features/dsa-visualizer/data'
import type { QuestionData } from '@/features/dsa-visualizer/types'

const LEVELS = [
  { level: 1, name: 'Level 1 - Must Know', rating: 5 },
  { level: 2, name: 'Level 2 - Very Common', rating: 5 },
  { level: 3, name: 'Level 3 - Most Asked DSA', rating: 4 },
  { level: 4, name: 'Level 4 - Trees', rating: 4 },
  { level: 5, name: 'Level 5 - Dynamic Programming', rating: 3 },
]

const stars = (count: number) => '⭐'.repeat(count)

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Easy: { bg: '#16A34A22', text: '#4ADE80' },
  Medium: { bg: '#EA580C22', text: '#FB923C' },
  Hard: { bg: '#DC262622', text: '#F87171' },
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'var(--color-surface-container-low, #1A1A2E)',
    borderRight: '1px solid var(--color-border-muted, #2A2A4E)',
    color: 'var(--color-on-surface, #E0E0F0)',
    fontSize: 14,
    overflow: 'hidden',
  },
  header: {
    padding: '16px 16px 8px',
    borderBottom: '1px solid var(--color-border-subtle, #2A2A4E)',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '0.01em',
  },
  badge: {
    display: 'inline-block',
    marginTop: 6,
    padding: '2px 10px',
    borderRadius: 10,
    background: 'var(--color-primary, #8B5CF6)',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 600,
  },
  searchInput: {
    width: '100%',
    marginTop: 10,
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid var(--color-border-muted, #2A2A4E)',
    background: 'var(--color-surface-container-lowest, #0F0F1A)',
    color: 'var(--color-on-surface, #E0E0F0)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '4px 0',
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    cursor: 'pointer',
    userSelect: 'none' as const,
    borderBottom: '1px solid var(--color-border-subtle, #2A2A4E)',
    transition: 'background 0.15s',
  },
  levelTitle: {
    fontSize: 13,
    fontWeight: 600,
  },
  levelStars: {
    fontSize: 11,
    letterSpacing: '0.05em',
  },
  topicHeader: {
    padding: '6px 16px 6px 32px',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'var(--color-on-surface-variant, #9898B0)',
  },
  questionItem: (isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px 8px 40px',
    cursor: 'pointer',
    background: isSelected ? 'var(--color-primary, #8B5CF6)' : 'transparent',
    color: isSelected ? '#FFFFFF' : 'var(--color-on-surface, #E0E0F0)',
    transition: 'background 0.15s',
    fontSize: 13,
  }),
  questionTitle: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  difficultyBadge: (difficulty: string) => ({
    padding: '1px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: difficultyColors[difficulty].bg,
    color: difficultyColors[difficulty].text,
    flexShrink: 0,
  }),
  emptySearch: {
    padding: 24,
    textAlign: 'center' as const,
    color: 'var(--color-on-surface-variant, #9898B0)',
    fontSize: 13,
  },
}

interface QuestionBrowserProps {
  onSelect: (questionId: string) => void
  selectedId?: string
  className?: string
}

export function QuestionBrowser({ onSelect, selectedId, className }: QuestionBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1, 2]))

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return allQuestions
    const q = searchQuery.toLowerCase()
    return allQuestions.filter(item => item.title.toLowerCase().includes(q))
  }, [searchQuery])

  const groupedByLevel = useMemo(() => {
    const map = new Map<number, QuestionData[]>()
    for (const q of filteredQuestions) {
      const list = map.get(q.level) ?? []
      list.push(q)
      map.set(q.level, list)
    }
    return LEVELS.map(l => ({
      ...l,
      questions: map.get(l.level) ?? [],
    }))
  }, [filteredQuestions])

  const totalCount = allQuestions.length

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => {
      const next = new Set(prev)
      if (next.has(level)) next.delete(level)
      else next.add(level)
      return next
    })
  }

  const groupedByTopic = (questions: QuestionData[]) => {
    const map = new Map<string, QuestionData[]>()
    for (const q of questions) {
      const list = map.get(q.topic) ?? []
      list.push(q)
      map.set(q.topic, list)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }

  return (
    <div style={styles.container} className={className}>
      <div style={styles.header}>
        <div style={styles.title}>DSA Questions</div>
        <span style={styles.badge}>{totalCount} questions</span>
        <input
          style={styles.searchInput}
          placeholder="Search questions..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={styles.scrollArea}>
        {filteredQuestions.length === 0 && (
          <div style={styles.emptySearch}>
            No questions match your search.
          </div>
        )}

        {groupedByLevel.map(({ level, name, rating, questions }) => {
          if (questions.length === 0) return null
          const isExpanded = expandedLevels.has(level)
          const topicGroups = groupedByTopic(questions)

          return (
            <div key={level}>
              <div
                style={styles.levelHeader}
                onClick={() => toggleLevel(level)}
              >
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ fontSize: 10, color: 'var(--color-on-surface-variant, #9898B0)' }}
                >
                  ▶
                </motion.span>
                <span style={styles.levelTitle}>{name}</span>
                <span style={styles.levelStars}>{stars(rating)}</span>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`level-${level}-content`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {topicGroups.map(([topic, topicQuestions]) => (
                      <div key={`${level}-${topic}`}>
                        <div style={styles.topicHeader}>{topic}</div>
                        {topicQuestions.map(q => (
                          <div
                            key={q.id}
                            style={styles.questionItem(selectedId === q.id)}
                            onClick={() => onSelect(q.id)}
                          >
                            <span style={styles.questionTitle}>{q.title}</span>
                            <span style={styles.difficultyBadge(q.difficulty)}>
                              {q.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}