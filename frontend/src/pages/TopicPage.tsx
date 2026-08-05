import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { topicService } from '@/services/topicService'
import { quizService } from '@/services/quizService'
import { flashcardService } from '@/services/flashcardService'
import { adminService } from '@/services/adminService'
import { useAuthStore } from '@/store/authStore'
import { TopicContent } from '@/features/topics/components/TopicContent'

const ADMIN_EMAIL = 'sarcasticsahal@gmail.com'

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-error)',
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const [contentLanguage, setContentLanguage] = useState<'roman' | 'english'>('roman')
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: topic, isLoading } = useQuery({
    queryKey: ['topic', slug],
    queryFn: () => topicService.getBySlug(slug!),
    enabled: !!slug,
  })

  const regenerateMutation = useMutation({
    mutationFn: () => adminService.regenerateTopicContent(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', slug] })
    },
  })

  const generateMcqsMutation = useMutation({
    mutationFn: () => quizService.ensureTopicQuiz(slug!),
    onSuccess: (data) => {
      navigate(`/quizzes/${data.id}`)
    },
  })

  const generateFlashcardsMutation = useMutation({
    mutationFn: () => flashcardService.generateForTopic(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic', slug] })
    },
  })

  const siblings = topic?.relatedTopics ?? []
  const idx = topic ? topic.order - 1 : -1
  const prev = siblings[idx - 1]
  const next = siblings[idx + 1]
  const difficultyColor = LEVEL_COLOR[topic?.difficulty ?? ''] || 'var(--color-outline)'

  if (isLoading) {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
        <p className="mt-4 text-sm flex items-center justify-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          <span className="material-symbols-outlined text-base" style={{ color: 'var(--color-primary)' }}>auto_awesome</span>
          Generating AI content…
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-outline)' }}>
          Your first visit creates a tailored explanation...
        </p>
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

  const quiz = topic.quizzes[0]

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* ═══════ Hero ═══════ */}
      <section
        className="relative overflow-hidden rounded-2xl border border-[var(--color-border-muted)] bg-[var(--color-surface-container-lowest)] px-5 py-6 sm:px-8 sm:py-8 animate-fade-up"
      >
        <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full blur-3xl" style={{ background: 'var(--color-ai-glow)' }} />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full blur-3xl" style={{ background: 'rgba(76,215,246,0.06)' }} />

        <div className="relative z-10">
          <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--color-outline)' }}>
            <Link to="/library" className="flex items-center gap-1 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[15px]">library_books</span>
              Library
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to={`/library/${topic.technology.slug}`} className="hover:text-primary transition-colors">{topic.technology.name}</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span style={{ color: 'var(--color-on-surface-variant)' }} className="truncate">{topic.title}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{ background: `${difficultyColor}18`, color: difficultyColor, border: `1px solid ${difficultyColor}30` }}
                >
                  <span className="material-symbols-outlined text-[13px]" style={{ fontSize: 13 }}>speed</span>
                  {LEVEL_LABEL[topic.difficulty] || topic.difficulty}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}
                >
                  <span className="material-symbols-outlined text-[13px]">dns</span>
                  {topic.technology.name}
                </span>
                {topic.completed && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <span className="material-symbols-outlined text-[13px]">task_alt</span>
                    Completed
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl font-semibold leading-tight mb-3 tracking-[-0.03em]"
                style={{ fontFamily: '"Inter", sans-serif', color: 'var(--color-on-surface)' }}
              >
                {topic.title}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                {topic.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Main grid ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 animate-fade-up animation-delay-100">
        <div className="lg:col-span-7 space-y-5">
          {/* Content */}
          <div className="bento-card overflow-hidden">
            <div
              className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-muted)]"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(208,188,255,0.12)' }}>
                  <span className="material-symbols-outlined text-base" style={{ color: 'var(--color-primary)' }}>article</span>
                </span>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--color-on-surface)' }}>Content</h3>
                  <p className="text-[11px]" style={{ color: 'var(--color-outline)' }}>Switch language for easier reading.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    disabled={regenerateMutation.isPending}
                    onClick={() => regenerateMutation.mutate()}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                    style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-tertiary)' }}
                  >
                    {regenerateMutation.isPending ? (
                      <span className="material-symbols-outlined text-[15px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    )}
                    {regenerateMutation.isPending ? 'Regenerating…' : 'Regenerate with AI'}
                  </button>
                )}
                <div className="flex rounded-full p-1" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                  {[
                    { value: 'roman', label: 'Roman Urdu' },
                    { value: 'english', label: 'English' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setContentLanguage(option.value as 'roman' | 'english')}
                      className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
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
            </div>
            <div className="px-5 py-6">
              <TopicContent content={topic.content} language={contentLanguage} />
            </div>
          </div>

          {/* Practice Quiz */}
          {quiz ? (
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: 'rgba(208,188,255,0.05)', border: '1px solid rgba(208,188,255,0.18)' }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(208,188,255,0.12)' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>quiz</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1 tracking-[-0.01em]" style={{ color: 'var(--color-on-surface)' }}>Practice Quiz</h3>
                <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]" style={{ color: 'var(--color-primary)' }}>question_mark</span>
                    {quiz.questionCount} questions
                  </span>
                  <span className="text-white/15">•</span>
                  <span className="capitalize inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]" style={{ color: difficultyColor }}>tune</span>
                    {quiz.difficulty} level
                  </span>
                </p>
              </div>
              <Link
                to={`/quizzes/${quiz.id}`}
                className="inline-flex items-center gap-2 justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:filter hover:brightness-110 active:scale-95"
                style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--color-primary)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                Continue <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: 'rgba(139,92,246,0.06)', border: '1px dashed rgba(139,92,246,0.35)' }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>auto_awesome</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1 tracking-[-0.01em]" style={{ color: 'var(--color-on-surface)' }}>Generate MCQs</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Click to generate 15 multiple-choice questions for <strong style={{ color: 'var(--color-on-surface)' }}>{topic.title}</strong> with AI.
                </p>
              </div>
              <button
                type="button"
                disabled={generateMcqsMutation.isPending}
                onClick={() => generateMcqsMutation.mutate()}
                className="inline-flex items-center gap-2 justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:filter hover:brightness-110 active:scale-95 disabled:opacity-60"
                style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--color-primary)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                {generateMcqsMutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Generating…
                  </>
                ) : (
                  <>
                    Generate MCQs <span className="material-symbols-outlined text-[16px]">quiz</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Flashcards */}
          {topic.flashCards.length > 0 ? (
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-success)' }}>style</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1 tracking-[-0.01em]" style={{ color: 'var(--color-on-surface)' }}>Flashcards</h3>
                <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]" style={{ color: 'var(--color-success)' }}>style</span>
                    {topic.flashCards.length} flashcards for {topic.title}
                  </span>
                </p>
              </div>
              <Link
                to="/flashcards"
                className="inline-flex items-center gap-2 justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:filter hover:brightness-110 active:scale-95"
                style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.28)' }}
              >
                Review Flashcards <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: 'rgba(16,185,129,0.06)', border: '1px dashed rgba(16,185,129,0.35)' }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-success)' }}>style</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1 tracking-[-0.01em]" style={{ color: 'var(--color-on-surface)' }}>Generate Flashcards</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Click to generate 10 AI flashcards for <strong style={{ color: 'var(--color-on-surface)' }}>{topic.title}</strong>. They&apos;ll be saved to the Flashcards page.
                </p>
              </div>
              <button
                type="button"
                disabled={generateFlashcardsMutation.isPending}
                onClick={() => generateFlashcardsMutation.mutate()}
                className="inline-flex items-center gap-2 justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:filter hover:brightness-110 active:scale-95 disabled:opacity-60"
                style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.28)' }}
              >
                {generateFlashcardsMutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Generating…
                  </>
                ) : (
                  <>
                    Generate Flashcards <span className="material-symbols-outlined text-[16px]">style</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* AI Deep Dive */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.02) 100%)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </span>
              <span className="font-semibold text-sm tracking-[-0.01em]" style={{ color: 'var(--color-primary)' }}>AI Deep Dive</span>
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
              Get a personalized explanation of <strong style={{ color: 'var(--color-on-surface)' }}>{topic.title}</strong> tailored to your skill level — break down tough concepts or interview hints.
            </p>
            <Link
              to="/ai-tutor"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:border-primary/40 hover:text-primary active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border-muted)' }}
            >
              Open AI Tutor <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>smart_toy</span>
            </Link>
          </div>
        </div>

        {/* ═══════ Sidebar ═══════ */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Related Topics */}
          <div className="bento-card overflow-hidden">
            <div className="px-4 py-3.5 flex items-center gap-2 border-b border-[var(--color-border-muted)]" style={{ background: 'var(--color-surface-container-low)' }}>
              <span className="material-symbols-outlined text-base" style={{ color: 'var(--color-primary)' }}>menu_book</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>Related Topics</span>
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                {siblings.length}
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {siblings.map((s, i) => {
                const active = s.slug === slug
                return (
                  <Link
                    key={s.slug}
                    to={`/topics/${s.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      background: active ? 'var(--color-surface-container)' : 'transparent',
                      border: `1px solid ${active ? 'rgba(208,188,255,0.15)' : 'transparent'}`,
                      color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    }}
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-[10px] font-bold flex-shrink-0"
                      style={{
                        background: active ? 'rgba(208,188,255,0.12)' : 'var(--color-surface-container-high)',
                        color: active ? 'var(--color-primary)' : 'var(--color-outline)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate">{s.title}</span>
                    {active && <span className="material-symbols-outlined text-[14px]">radio_button_checked</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Code Lab */}
          <div className="bento-card p-5">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl flex-shrink-0" style={{ color: 'var(--color-tertiary)' }}>data_object</span>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1 tracking-[-0.01em]" style={{ color: 'var(--color-on-surface)' }}>Try in Code Lab</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>Paste an example, run it, and get instant AI-powered analysis.</p>
              </div>
            </div>
            <Link
              to="/code-analyzer"
              className="mt-4 inline-flex items-center gap-2 w-full justify-center px-3 py-2 rounded-full text-xs font-semibold transition-all hover:border-primary/40 hover:text-primary active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border-muted)' }}
            >
              Open Code Lab <span className="material-symbols-outlined text-[14px]" style={{ color: 'var(--color-primary)' }}>terminal</span>
            </Link>
          </div>

          {/* Prev / Next */}
          <div className="flex gap-3">
            {prev ? (
              <Link
                to={`/topics/${prev.slug}`}
                className="group flex-1 flex items-center gap-2 p-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5"
                style={{ border: '1px solid var(--color-border-muted)', background: 'var(--color-surface-container-lowest)', color: 'var(--color-on-surface-variant)' }}
              >
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5" style={{ color: 'var(--color-primary)' }}>arrow_back</span>
                <span className="truncate font-medium">{prev.title}</span>
              </Link>
            ) : <div className="flex-1" />}
            {next ? (
              <Link
                to={`/topics/${next.slug}`}
                className="group flex-1 flex items-center justify-end gap-2 p-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5"
                style={{ border: '1px solid var(--color-border-muted)', background: 'var(--color-surface-container-lowest)', color: 'var(--color-on-surface-variant)' }}
              >
                <span className="truncate font-medium">{next.title}</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--color-primary)' }}>arrow_forward</span>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </div>
      </div>
    </div>
  )
}