import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService, type AdminFormattedInterviewDetail } from '@/services/adminService'
import { useAuthStore } from '@/store/authStore'
import { InstagramQuestionCard } from '@/components/admin/InstagramQuestionCard'
import { InstagramAnswersCard } from '@/components/admin/InstagramAnswersCard'
import { InstagramInterviewCard } from '@/components/admin/InstagramInterviewCard'
import { InstagramCodeCard } from '@/components/admin/InstagramCodeCard'
import { captureToDataUrl, generateInstagramZip, triggerDownload } from '@/utils/instagramGenerator'
import { extractCodeBlocks } from '@/utils/interviewMarkdown'
import { materialIconName } from '@/components/common/MaterialIcon'

const ADMIN_EMAIL = 'sarcasticsahal@gmail.com'

type Tab = 'quiz' | 'interview'

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function AdminPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<Tab>('quiz')
  const [selectedQuizId, setSelectedQuizId] = useState<string>('')
  const [selectedInterviewSlug, setSelectedInterviewSlug] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const captureContainerRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  const { data: quizzes = [] } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => adminService.getQuizzes(),
    enabled: isAdmin,
  })

  const { data: quizDetail } = useQuery({
    queryKey: ['admin-quiz', selectedQuizId],
    queryFn: () => adminService.getQuiz(selectedQuizId),
    enabled: isAdmin && !!selectedQuizId,
  })

  const { data: interviewTopics = [] } = useQuery({
    queryKey: ['admin-interview-topics'],
    queryFn: () => adminService.getInterviewTopics(),
    enabled: isAdmin,
  })

  const { data: interviewDetail } = useQuery({
    queryKey: ['admin-interview', selectedInterviewSlug],
    queryFn: () => adminService.getInterviewQuestions(selectedInterviewSlug),
    enabled: isAdmin && !!selectedInterviewSlug,
  })

  const [formattedInterview, setFormattedInterview] = useState<AdminFormattedInterviewDetail | null>(null)
  const [isFormatting, setIsFormatting] = useState(false)

  const quizQuestions = useMemo(() => quizDetail?.questions ?? [], [quizDetail])
  const interviewQuestions = useMemo(() => interviewDetail?.questions ?? [], [interviewDetail])

  const interviewRenderItems = useMemo(
    () =>
      interviewQuestions.map((q) => {
        const formatted = formattedInterview?.questions.find((f) => f.number === q.number)
        const question = formatted?.question || q.question
        const answer = formatted?.answer || q.answer
        const { code, cleaned } = extractCodeBlocks(answer)
        return { q, question, answer: cleaned, code }
      }),
    [interviewQuestions, formattedInterview]
  )

  const totalInterviewCards = interviewRenderItems.reduce(
    (n, it) => n + 1 + (it.code.length ? 1 : 0),
    0
  )

  const handleFormatInterview = async () => {
    if (!selectedInterviewSlug || isFormatting) return
    setIsFormatting(true)
    try {
      const formatted = await adminService.formatInterviewAnswers(selectedInterviewSlug)
      setFormattedInterview(formatted)
    } finally {
      setIsFormatting(false)
    }
  }

  const handleDownloadQuiz = async () => {
    if (!quizDetail || !captureContainerRef.current || quizQuestions.length === 0) return
    setIsGenerating(true)
    try {
      const container = captureContainerRef.current
      const base = slugify(quizDetail.topic?.title || quizDetail.title)
      const items: { element: HTMLElement; name: string }[] = Array.from(
        container.querySelectorAll<HTMLElement>('[data-card]')
      ).map((el) => ({
        element: el,
        name: el.getAttribute('data-name') || 'card.png',
      }))
      const zipBlob = await generateInstagramZip(items)
      triggerDownload(zipBlob, `${base}-quiz.zip`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadInterview = async () => {
    if (!interviewDetail || !captureContainerRef.current || interviewQuestions.length === 0) return
    setIsGenerating(true)
    try {
      const container = captureContainerRef.current
      const base = slugify(interviewDetail.name)
      const items: { element: HTMLElement; name: string }[] = Array.from(
        container.querySelectorAll<HTMLElement>('[data-card]')
      ).map((el) => ({
        element: el,
        name: el.getAttribute('data-name') || 'card.png',
      }))
      const zipBlob = await generateInstagramZip(items)
      triggerDownload(zipBlob, `${base}-interview.zip`)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="px-6 py-16 max-w-2xl mx-auto text-center">
        <span className="material-symbols-outlined text-6xl block mb-4" style={{ color: 'var(--color-error)' }}>
          lock
        </span>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--color-on-surface)' }}>Access Denied</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          This admin area is restricted. Only the designated admin email can access it.
        </p>
      </div>
    )
  }

  const tabBtn = (t: Tab, label: string, icon: string) => (
    <button
      onClick={() => setTab(t)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: tab === t ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
        color: tab === t ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
      }}
    >
      <span className={`material-symbols-outlined text-[18px]`}>{materialIconName(icon)}</span>
      {label}
    </button>
  )

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>admin_panel_settings</span>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            Instagram Post Studio
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Generate Instagram-ready post images for quizzes and interview questions — one image per question, downloadable as a ZIP.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {tabBtn('quiz', 'Quiz Posts', 'quiz')}
        {tabBtn('interview', 'Interview Posts', 'record_voice_over')}
      </div>

      {tab === 'quiz' && (
        <div className="space-y-6">
          <div className="bento-card p-5">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-outline)' }}>
              Select Quiz
            </label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border-muted)', fontFamily: 'var(--font-sans)' }}
            >
              <option value="">Choose a quiz…</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.topic?.title || 'Untitled'} — {q.title} ({q.questionCount} questions)
                </option>
              ))}
            </select>

            {selectedQuizId && quizDetail && quizQuestions.length > 0 && (
              <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {quizQuestions.length} question images + 1 answers image
                </div>
                <button
                  onClick={handleDownloadQuiz}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
                >
                  <span className="material-symbols-outlined text-[18px]">{isGenerating ? 'progress_activity' : 'file_download'}</span>
                  {isGenerating ? 'Generating…' : 'Download ZIP'}
                </button>
              </div>
            )}
          </div>

          {quizQuestions.length > 0 && (
            <InstagramPreview
              cards={quizQuestions.map((q, i) => (
                <InstagramQuestionCard
                  key={q.id}
                  quizTitle={quizDetail!.title}
                  topicTitle={quizDetail!.topic?.title || ''}
                  index={i}
                  total={quizQuestions.length}
                  question={q.text}
                  options={q.options}
                />
              )).concat([
                <InstagramAnswersCard
                  key="answers"
                  quizTitle={quizDetail!.title}
                  topicTitle={quizDetail!.topic?.title || ''}
                  answers={quizQuestions.map((q, i) => ({ index: i, text: q.text, correctAnswer: q.correctAnswer }))}
                />,
              ])}
              names={quizQuestions.map((q, i) => `${String(i + 1).padStart(2, '0')}-${slugify(q.text).slice(0, 30)}.png`).concat([
                'answers.png',
              ])}
              captureRef={captureContainerRef}
              captureKey={selectedQuizId}
            />
          )}
        </div>
      )}

      {tab === 'interview' && (
        <div className="space-y-6">
          <div className="bento-card p-5">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-outline)' }}>
              Select Interview Topic
            </label>
            <select
              value={selectedInterviewSlug}
              onChange={(e) => {
                setSelectedInterviewSlug(e.target.value)
                setFormattedInterview(null)
              }}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border-muted)', fontFamily: 'var(--font-sans)' }}
            >
              <option value="">Choose a topic…</option>
              {interviewTopics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.questionCount} questions)
                </option>
              ))}
            </select>

            {selectedInterviewSlug && interviewDetail && interviewQuestions.length > 0 && (
              <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {totalInterviewCards} images
                  {formattedInterview ? ' · AI-formatted' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFormatInterview}
                    disabled={isFormatting || !!formattedInterview}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                    style={{
                      background: formattedInterview ? 'var(--color-success)' : 'var(--color-surface-container-high)',
                      color: formattedInterview ? '#ffffff' : 'var(--color-on-surface-variant)',
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isFormatting ? 'progress_activity' : formattedInterview ? 'check_circle' : 'auto_awesome'}</span>
                    {isFormatting ? 'Formatting…' : formattedInterview ? 'Formatted' : 'Format with AI'}
                  </button>
                  <button
                    onClick={handleDownloadInterview}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isGenerating ? 'progress_activity' : 'file_download'}</span>
                    {isGenerating ? 'Generating…' : 'Download ZIP'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {interviewRenderItems.length > 0 && (() => {
            const cards: React.ReactNode[] = []
            const names: string[] = []
            let idx = 1
            for (const it of interviewRenderItems) {
              const q = it.q
              cards.push(
                <InstagramInterviewCard
                  key={`a-${q.number}`}
                  topicTitle={interviewDetail!.name}
                  index={idx - 1}
                  total={totalInterviewCards}
                  question={it.question}
                  answer={it.answer}
                />
              )
              names.push(`${pad(idx)}-${slugify(it.question).slice(0, 30)}.png`)
              idx += 1
              if (it.code.length > 0) {
                cards.push(
                  <InstagramCodeCard
                    key={`c-${q.number}`}
                    topicTitle={interviewDetail!.name}
                    index={idx - 1}
                    total={totalInterviewCards}
                    question={it.question}
                    code={it.code}
                  />
                )
                names.push(`${pad(idx)}-${slugify(it.question).slice(0, 30)}-code.png`)
                idx += 1
              }
            }
            return (
              <InstagramPreview
                cards={cards}
                names={names}
                captureRef={captureContainerRef}
                captureKey={`${selectedInterviewSlug}-${formattedInterview ? 'ai' : 'raw'}`}
              />
            )
          })()}
        </div>
      )}
    </div>
  )
}

function InstagramPreview({
  cards,
  names,
  captureRef,
  captureKey,
}: {
  cards: React.ReactNode[]
  names: string[]
  captureRef: React.RefObject<HTMLDivElement | null>
  captureKey: string
}) {
  const [thumbs, setThumbs] = useState<(string | null)[]>([])

  useEffect(() => {
    let cancelled = false
    const container = captureRef.current
    if (!container || cards.length === 0) {
      setThumbs([])
      return
    }
    setThumbs(cards.map(() => null))
    const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-card]'))
    const captured: (string | null)[] = []
    let settled = 0
    nodes.forEach((node, i) => {
      captureToDataUrl(node, 0.35)
        .then((url) => { captured[i] = url })
        .catch(() => { captured[i] = null })
        .finally(() => {
          settled += 1
          if (!cancelled && settled === nodes.length) setThumbs(captured)
        })
    })
    return () => { cancelled = true }
  }, [captureKey, cards.length, captureRef])

  return (
    <>
      <div className="bento-card p-5">
        <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--color-on-surface)' }}>Preview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border-muted)' }}>
              <div className="relative" style={{ paddingTop: '125%' }}>
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{ background: 'var(--color-surface-container)' }}
                >
                  {thumbs[i] ? (
                    <img
                      src={thumbs[i]}
                      alt={names[i]}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-outline)' }}>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      Rendering…
                    </div>
                  )}
                </div>
              </div>
              <div className="px-3 py-2 text-[11px] truncate" style={{ color: 'var(--color-outline)', borderTop: '1px solid var(--color-border-subtle)' }}>
                {names[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={captureRef} aria-hidden style={{ position: 'absolute', top: 0, left: -20000, pointerEvents: 'none', zIndex: -1 }}>
        {cards.map((card, i) => (
          <div key={i} data-card data-name={names[i]}>
            {card}
          </div>
        ))}
      </div>
    </>
  )
}
