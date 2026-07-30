import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AnimateOnScroll } from '@/components/common/AnimateOnScroll'
import dashboardImg from '@/assets/dashboard.png'

const faqs = [
  { q: 'Is DevPrep AI free to use?', a: 'Yes, we offer a generous free tier with access to roadmaps, quizzes, and limited AI tutor sessions. Premium plans unlock unlimited AI interactions, advanced code labs, and priority support.' },
  { q: 'How does the AI tutor work?', a: 'Our AI tutor uses GPT-4o to provide real-time explanations, code reviews, and hints. You can ask questions about any topic, get code walkthroughs, or request personalized study plans.' },
  { q: 'What topics are covered?', a: 'From data structures and algorithms to system design, frontend frameworks, and DevOps — we cover 40+ technologies with 500+ hours of curated content updated quarterly.' },
  { q: 'Can I practice company-specific questions?', a: 'Absolutely. Our platform includes curated question banks from top tech companies (FAANG, fintech, startups) with company-specific mock interviews and grading rubrics.' },
  { q: 'How are quizzes and roadmaps created?', a: 'Content is crafted by senior engineers from top companies and refined by AI. Each question includes detailed explanations, and roadmaps adapt to your progress automatically.' },
]

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">

      {/* ═══════ 1. Hero — glow + centered ═══════ */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-15 pointer-events-none"
             style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent)' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-8 pointer-events-none"
             style={{ background: 'radial-gradient(circle, var(--color-tertiary), transparent)' }} />

        <div className="relative z-10 max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
               style={{ background: 'rgba(208,188,255,0.1)', border: '1px solid rgba(208,188,255,0.25)', color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Powered by GPT-4o · 50,000+ developers
          </div>

          <h1 className="font-extrabold mb-6 leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: 'var(--color-on-surface)' }}>
            Ace Your Technical<br />
            <span style={{ color: 'var(--color-primary)' }}>Interview</span> with AI
          </h1>
          <p className="text-base max-w-xl mx-auto mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
            Structured roadmaps, AI-powered coding labs, and a personal tutor that adapts to your skill level. Go from beginner to job-ready in weeks.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/register"
                  className="px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Start for Free →
            </Link>
            <Link to="/learning-paths"
                  className="px-7 py-3.5 rounded-xl font-bold text-base transition-all hover:border-primary"
                  style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)' }}>
              Browse Roadmaps
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 2. Platform Overview — MacBook mockup ═══════ */}
      <section className="relative px-6 py-28 overflow-hidden"
               style={{
                 background: 'linear-gradient(180deg, rgba(208,188,255,0.02) 0%, transparent 40%, transparent 100%)',
               }}>
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full opacity-[0.03]"
               style={{
                 backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
               }} />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
                   style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>overview</span>
                PLATFORM OVERVIEW
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                Your entire interview prep, in one place
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
                From roadmaps to mock interviews — everything you need, beautifully organized in a single dashboard.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="relative flex flex-col items-center">
              {/* Ambient glow behind screen */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[80%] h-48 blur-[80px] opacity-20 pointer-events-none rounded-full"
                   style={{ background: 'radial-gradient(ellipse, var(--color-primary), transparent)' }} />

              {/* ── MacBook Screen ── */}
              <div className="relative w-full max-w-4xl rounded-[16px] overflow-hidden z-10"
                   style={{
                     background: '#1a1a1a',
                     border: '1.5px solid rgba(255,255,255,0.08)',
                     boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 60px rgba(208,188,255,0.03)',
                     aspectRatio: '16/10',
                   }}>
                {/* Inner screen bezel */}
                <div className="absolute inset-[3px] rounded-[12px] overflow-hidden"
                     style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-b-lg z-20"
                       style={{ background: '#1a1a1a' }} />

                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5"
                       style={{ background: 'var(--color-surface-container)' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
                    <div className="ml-3 flex-1 max-w-xs rounded-md py-1 px-3 text-xs text-center truncate"
                         style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                      app.devprep.ai/dashboard
                    </div>
                    <div className="flex items-center gap-1 ml-auto text-xs" style={{ color: 'var(--color-outline)' }}>
                      <span className="material-symbols-outlined text-[14px]">more_vert</span>
                    </div>
                  </div>

                  {/* Dashboard screenshot */}
                  <img
                    src={dashboardImg}
                    alt="DevPrep AI Dashboard"
                    className="w-full h-full object-cover block"
                    style={{ height: 'calc(100% - 40px)' }}
                  />
                </div>
              </div>

              {/* ── Hinge ── */}
              <div className="relative z-10 w-[102%] max-w-[1070px] h-[10px] rounded-b-xl flex items-end justify-center -mt-[2px]"
                   style={{
                     background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                     border: '1px solid rgba(255,255,255,0.04)',
                     borderTop: 'none',
                   }}>
                <div className="w-[30%] h-[3px] rounded-full opacity-30" style={{ background: 'var(--color-primary)' }} />
              </div>

              {/* ── Keyboard Deck ── */}
              <div className="relative z-0 w-[108%] max-w-[1120px] h-12 -mt-[1px]"
                   style={{
                     background: 'linear-gradient(180deg, #2a2a2a 0%, #222 50%, #1a1a1a 100%)',
                     border: '1px solid rgba(255,255,255,0.04)',
                     borderTop: 'none',
                     borderRadius: '0 0 6px 6px',
                     transform: 'perspective(500px) rotateX(6deg)',
                     transformOrigin: 'top center',
                   }} />

              {/* ── Shadow on surface ── */}
              <div className="w-[110%] max-w-[1160px] h-8 -mt-2 rounded-full blur-2xl opacity-25 pointer-events-none"
                   style={{ background: 'rgba(0,0,0,0.5)' }} />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 3. Features — colored icon grid ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            Everything you need to prepare
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Six integrated tools that work together to take you from zero to interview-ready.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: 'map',         color: 'var(--color-primary)',   title: 'Guided Roadmaps',    desc: 'Curated learning paths built by senior engineers at top tech companies.' },
            { icon: 'smart_toy',   color: 'var(--color-secondary)', title: 'AI Tutor',           desc: 'Get instant explanations, code reviews, and personalized hints from your AI mentor.' },
            { icon: 'data_object', color: 'var(--color-tertiary)',  title: 'Live Code Lab',      desc: 'Write, run, and analyze code with real-time AI feedback on complexity and edge cases.' },
            { icon: 'quiz',        color: 'var(--color-success)',   title: 'Adaptive Quizzes',   desc: 'Dynamic assessments that adjust difficulty based on your performance history.' },
            { icon: 'style',       color: 'var(--color-warning)',   title: 'Flashcard Decks',    desc: 'Spaced-repetition flashcards engineered for maximum knowledge retention.' },
            { icon: 'leaderboard', color: 'var(--color-error)',     title: 'Progress Tracking',  desc: 'Detailed analytics, streak tracking, and skill benchmarks against your peer group.' },
          ].map((f, i) => (
            <AnimateOnScroll key={f.title} delay={i * 80}>
              <div className="bento-card ai-glow-border group p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                     style={{ background: `${f.color}15` }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: f.color, fontVariationSettings: "'FILL' 0" }}>{f.icon}</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{f.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════ 3. AI Tools — Coding Practice + Resume Optimizer merged ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
                 style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              AI-POWERED TOOLS
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              Supercharge your job search
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              Two powerful AI tools to help you land your next role
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coding Practice */}
          <AnimateOnScroll>
            <div className="relative overflow-hidden rounded-2xl p-8"
                 style={{
                   background: 'linear-gradient(135deg, rgba(76,215,246,0.08) 0%, rgba(76,215,246,0.02) 100%)',
                   border: '1px solid rgba(76,215,246,0.15)',
                 }}>
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                   style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ background: 'rgba(76,215,246,0.15)' }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: 'var(--color-secondary)', fontVariationSettings: "'FILL' 1" }}>data_object</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Coding Practice</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Solve real DSA problems with AI-powered evaluation. Get instant feedback on correctness, edge cases, and complexity.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['150+ Questions', '5 Levels', '2 Languages', 'Instant AI Check'].map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(76,215,246,0.1)', color: 'var(--color-secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to="/code-analyzer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>
                  Start Coding
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Resume Optimizer */}
          <AnimateOnScroll delay={120}>
            <div className="relative overflow-hidden rounded-2xl p-8"
                 style={{
                   background: 'linear-gradient(135deg, rgba(208,188,255,0.08) 0%, rgba(208,188,255,0.02) 100%)',
                   border: '1px solid rgba(208,188,255,0.15)',
                 }}>
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                   style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ background: 'rgba(208,188,255,0.15)' }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>description</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Resume Optimizer</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Upload your resume and job description. Get an ATS-optimized resume, cover letter, and detailed gap analysis.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['ATS Score', '5 Templates', 'Cover Letter', 'DOCX Export'].map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to="/resume-optimizer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Optimize Resume
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 4. Why DevPrep AI — side-by-side cards ═══════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            Why DevPrep AI?
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            See how AI-powered preparation stacks up against the old way.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimateOnScroll>
            <div className="rounded-2xl p-7" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-error)', fontVariationSettings: "'FILL' 1" }}>close</span>
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>Traditional Prep</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Scattered resources across dozens of sites',
                  'No feedback on your code quality',
                  'Static study plans that ignore your gaps',
                  'Hours wasted searching for explanations',
                  'No way to simulate real interview pressure',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ color: 'var(--color-error)', fontVariationSettings: "'FILL' 1" }}>close_small</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={150}>
            <div className="rounded-2xl p-7" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>DevPrep AI</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'All-in-one platform: roadmaps, labs, quizzes',
                  'Real-time AI code reviews & feedback',
                  'Adaptive plans that target your weak spots',
                  'Instant AI explanations for any question',
                  'Mock interviews with company-specific questions',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>check_small</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 5. Start in Minutes — dashboard mockup ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            Start in minutes
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Everything you need, right when you open your dashboard.
          </p>
        </AnimateOnScroll>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border-subtle)' }}>
          {/* Mock browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'var(--color-surface-container)', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
            <div className="ml-4 flex-1 max-w-md rounded-lg py-1.5 px-3 text-xs" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
              app.devprep.ai/dashboard
            </div>
          </div>
          {/* Dashboard content */}
          <div className="p-6 md:p-8" style={{ background: 'var(--color-surface-container-lowest)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(208,188,255,0.12)' }}>
                    <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>dashboard_customize</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>Your personalized dashboard</h3>
                    <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>At a glance: streak, milestones, recent scores, and AI suggestions.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: '87%', label: 'Avg. quiz score', color: 'var(--color-primary)' },
                    { value: '12', label: 'Day streak', color: 'var(--color-success)' },
                    { value: '4', label: 'Roadmaps', color: 'var(--color-warning)' },
                    { value: '23', label: 'Code labs', color: 'var(--color-tertiary)' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--color-surface-container)' }}>
                      <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: 'trending_up', color: 'var(--color-success)', title: 'Track progress', desc: 'Skill benchmarks, XP, and weekly growth charts.' },
                  { icon: 'psychology', color: 'var(--color-warning)', title: 'AI at your side', desc: 'Ask anything, get instant answers with examples.' },
                  { icon: 'group', color: 'var(--color-tertiary)', title: 'Join community', desc: 'Compare scores with 50K+ peers on leaderboard.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 6. For Everyone — timeline style ═══════ */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            Built for every stage of your career
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-14 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Whether you're writing your first for-loop or preparing for Staff Engineer — DevPrep AI meets you where you are.
          </p>
        </AnimateOnScroll>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary), var(--color-tertiary))' }} />
          <div className="space-y-10">
            {[
              { icon: 'school', color: 'var(--color-primary)', title: 'Students', desc: 'Build a strong CS foundation with guided curricula and instant AI tutoring for homework and interview prep.' },
              { icon: 'rocket_launch', color: 'var(--color-success)', title: 'Bootcamp Grads', desc: 'Fill the gaps bootcamps leave behind. Master DS&A, system design, and ace the technical screen.' },
              { icon: 'code', color: 'var(--color-warning)', title: 'Experienced Engineers', desc: 'Level up for senior roles. System design deep-dives, advanced algorithms, and staff-level mock interviews.' },
              { icon: 'switch_access', color: 'var(--color-tertiary)', title: 'Career Switchers', desc: 'Transition into tech with a structured path. No fluff — just the skills employers actually ask about.' },
            ].map((p, i) => (
              <AnimateOnScroll key={p.title} delay={i * 100}>
                <div className="flex items-start gap-6 pl-0">
                  <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                       style={{ background: 'var(--color-surface-container-lowest)', border: `2px solid ${p.color}` }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: p.color, fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{p.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 7. How It Works — horizontal steps ═══════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            How it works
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-14 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Four simple steps to interview mastery.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', icon: 'person_add', title: 'Create Account', desc: 'Sign up free and set your target companies, role, and experience level.' },
            { step: '02', icon: 'route', title: 'Pick a Roadmap', desc: 'Choose from 40+ curated paths or let AI build a personalized plan.' },
            { step: '03', icon: 'psychology', title: 'Learn & Practice', desc: 'Study with AI tutor, solve coding labs, and take adaptive quizzes daily.' },
            { step: '04', icon: 'work_history', title: 'Crush the Interview', desc: 'Simulate real interviews with company-specific questions and time pressure.' },
          ].map((s, i) => (
            <AnimateOnScroll key={s.step} delay={i * 120}>
              <div className="flex flex-col items-center text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-40px)] h-[2px]"
                       style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-border-muted))' }} />
                )}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                     style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <div className="text-xs font-bold mb-2 px-3 py-1 rounded-full" style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
                  Step {s.step}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>{s.title}</h3>
                <p className="text-sm max-w-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{s.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════ 8. Testimonials — scrollable rows ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            Loved by engineers
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Hear from developers who landed their dream roles.
          </p>
        </AnimateOnScroll>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
          {[
            { name: 'Sarah Chen', role: 'SWE @ Google', avatar: 'S', quote: 'The AI tutor saved me weeks of grinding. Instead of hunting through docs, I just asked and got instant, accurate explanations tailored to my gap.' },
            { name: 'James Park', role: 'SWE @ Stripe', avatar: 'J', quote: 'I failed two onsites before finding this. The company-specific mocks and code labs with AI feedback were the game-changer for my third attempt.' },
            { name: 'Priya Patel', role: 'SWE @ Microsoft', avatar: 'P', quote: 'The adaptive quizzes exposed blind spots I didn\'t even know I had. Three months of daily practice, and I went from mid-tier to FAANG offer.' },
          ].map((t, i) => (
            <AnimateOnScroll key={t.name} delay={i * 100}>
              <div className="min-w-[340px] md:min-w-[380px] rounded-2xl p-7 snap-start flex flex-col"
                   style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-warning)', fontVariationSettings: '"FILL" 1' }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                       style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════ 9. FAQ — accordion ═══════ */}
      <section className="px-6 py-20 max-w-3xl mx-auto w-full">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-on-surface)' }}>
            Frequently asked questions
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="text-sm text-center mb-12 max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
            Everything you need to know about DevPrep AI.
          </p>
        </AnimateOnScroll>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <AnimateOnScroll key={i} delay={i * 60}>
              <div className="overflow-hidden rounded-xl transition-all duration-200"
                   style={{ background: openFaq === i ? 'rgba(208,188,255,0.04)' : 'var(--color-surface-container)', border: '1px solid var(--color-border-subtle)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left transition-all"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  <span className="text-sm font-semibold pr-4">{faq.q}</span>
                  <span className={`material-symbols-outlined text-[20px] transition-all duration-200 flex-shrink-0`}
                        style={{
                          color: 'var(--color-primary)',
                          transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                          fontVariationSettings: "'FILL' 1",
                        }}>
                    expand_more
                  </span>
                </button>
                <div className="overflow-hidden transition-all duration-300"
                     style={{ maxHeight: openFaq === i ? '200px' : '0px' }}>
                  <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ═══════ 10. Final CTA — gradient card ═══════ */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full text-center">
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-16"
               style={{
                 background: 'linear-gradient(135deg, rgba(208,188,255,0.1) 0%, rgba(76,215,246,0.05) 50%, rgba(255,184,105,0.05) 100%)',
                 border: '1px solid rgba(208,188,255,0.15)',
               }}>
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent)' }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--color-on-surface)' }}>
                Ready to ace your interview?
              </h2>
              <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: 'var(--color-on-surface-variant)' }}>
                Join 50,000+ developers who are already preparing smarter with DevPrep AI. Start free, upgrade when you need more.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link to="/register"
                      className="px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95"
                      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Create Free Account →
                </Link>
                <Link to="/quizzes"
                      className="px-8 py-3.5 rounded-xl font-bold text-base transition-all"
                      style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)' }}>
                  Try a Quiz
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

    </div>
  )
}
