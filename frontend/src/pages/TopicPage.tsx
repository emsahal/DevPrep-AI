import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { topicService } from '@/services/topicService'
import { TopicContent } from '@/features/topics/components/TopicContent'

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-error)',
}

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const [contentLanguage, setContentLanguage] = useState<'roman' | 'english'>('roman')

  const { data: topic, isLoading } = useQuery({
    queryKey: ['topic', slug],
    queryFn: () => topicService.getBySlug(slug!),
    enabled: !!slug,
  })

  const siblings = topic?.relatedTopics ?? []
  const idx = topic ? topic.order - 1 : -1
  const prev = siblings[idx - 1]
  const next = siblings[idx + 1]

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
      </div>
    )
  }

  if (!topic) return (
    <div className="px-6 py-20 max-w-3xl mx-auto text-center">
      <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: 'var(--color-border-muted)' }}>error</span>
      <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Topic not found</p>
      <Link to="/library" className="text-sm" style={{ color: 'var(--color-primary)' }}>← Back to Library</Link>
    </div>
  )

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <nav className="flex items-center gap-2 text-xs mb-6 animate-fade-up" style={{ color: 'var(--color-outline)' }}>
        <Link to="/library" className="hover:text-primary transition-colors">Library</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to={`/library/${topic.technology.slug}`} className="hover:text-primary transition-colors">{topic.technology.name}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>{topic.title}</span>
      </nav>

      <div className="mb-8 animate-fade-up animation-delay-100">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="pill" style={{ background: `${LEVEL_COLOR[topic.difficulty] || 'var(--color-outline)'}18`, color: LEVEL_COLOR[topic.difficulty] || 'var(--color-outline)', border: `1px solid ${LEVEL_COLOR[topic.difficulty] || 'var(--color-outline)'}30` }}>
            {topic.difficulty}
          </span>
          <span className="pill" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
            {topic.technology.name}
          </span>
          {topic.completed && (
            <span className="pill" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)' }}>
              ✓ Completed
            </span>
          )}
        </div>
        <h1 className="text-4xl font-extrabold leading-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
          {topic.title}
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: 'var(--color-on-surface-variant)' }}>
          {topic.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-up animation-delay-200">
        <div className="lg:col-span-7 space-y-5">
          <div className="bento-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>
                  Content
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
                  Switch language for easier reading.
                </p>
              </div>
              <div className="flex rounded-xl p-1" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                {[
                  { value: 'roman', label: 'Roman Urdu' },
                  { value: 'english', label: 'English' },
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setContentLanguage(option.value as 'roman' | 'english')}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                    style={{
                      background: contentLanguage === option.value ? 'var(--color-primary)' : 'transparent',
                      color: contentLanguage === option.value ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <TopicContent content={topic.content} language={contentLanguage} />
          </div>

          {topic.quizzes.length > 0 && (
            <div className="bento-card p-6">
              <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>
                Practice Quiz
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                {topic.quizzes[0].questionCount} questions · {topic.quizzes[0].difficulty}
              </p>
              <Link to={`/quizzes/${topic.quizzes[0].id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                Start Quiz <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}

          <div className="rounded-2xl p-5" style={{ background: 'rgba(208,188,255,0.06)', border: '1px solid rgba(208,188,255,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>AI Deep Dive</span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              Get a personalized explanation of <strong style={{ color: 'var(--color-on-surface)' }}>{topic.title}</strong> tailored to your skill level.
            </p>
            <Link to="/ai-tutor"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Open AI Tutor <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bento-card overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-border-muted)', background: 'var(--color-surface-container-low)' }}>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>Related Topics</span>
              <span className="ml-auto text-xs" style={{ color: 'var(--color-outline)' }}>{siblings.length} total</span>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {siblings.map((s, i) => (
                <Link key={s.slug} to={`/topics/${s.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-surface-container"
                      style={{ background: s.slug === slug ? 'rgba(208,188,255,0.1)' : 'transparent', color: s.slug === slug ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}>
                  <span className="text-[11px] w-5 text-right flex-shrink-0" style={{ color: 'var(--color-outline)' }}>{i + 1}</span>
                  <span className="flex-1 truncate">{s.title}</span>
                  {s.slug === slug && <span className="material-symbols-outlined text-[14px]">radio_button_checked</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="bento-card p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl flex-shrink-0" style={{ color: 'var(--color-tertiary)', fontVariationSettings: "'FILL' 0" }}>data_object</span>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>Try in Code Lab</p>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Run examples and get AI analysis.</p>
            </div>
            <Link to="/code-analyzer"
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: 'var(--color-tertiary)', color: '#2c1700' }}>
              Open
            </Link>
          </div>

          <div className="flex gap-3">
            {prev ? (
              <Link to={`/topics/${prev.slug}`}
                    className="flex-1 flex items-center gap-2 p-3 rounded-xl text-sm transition-all hover:border-primary"
                    style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span className="truncate">{prev.title}</span>
              </Link>
            ) : <div className="flex-1" />}
            {next ? (
              <Link to={`/topics/${next.slug}`}
                    className="flex-1 flex items-center justify-end gap-2 p-3 rounded-xl text-sm transition-all hover:border-primary"
                    style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)' }}>
                <span className="truncate">{next.title}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </div>
      </div>
    </div>
  )
}
