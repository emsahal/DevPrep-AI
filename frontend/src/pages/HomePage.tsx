import { Link } from 'react-router-dom'
import { useState } from 'react'

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

      {/* ═══════ 1. Hero ═══════ */}
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

      {/* ═══════ 2. Features ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          Everything you need to prepare
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          Six integrated tools that work together to take you from zero to interview-ready.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: 'map',         color: 'var(--color-primary)',   title: 'Guided Roadmaps',    desc: 'Curated learning paths built by senior engineers at top tech companies.' },
            { icon: 'smart_toy',   color: 'var(--color-secondary)', title: 'AI Tutor',           desc: 'Get instant explanations, code reviews, and personalized hints from your AI mentor.' },
            { icon: 'data_object', color: 'var(--color-tertiary)',  title: 'Live Code Lab',      desc: 'Write, run, and analyze code with real-time AI feedback on complexity and edge cases.' },
            { icon: 'quiz',        color: 'var(--color-success)',   title: 'Adaptive Quizzes',   desc: 'Dynamic assessments that adjust difficulty based on your performance history.' },
            { icon: 'style',       color: 'var(--color-warning)',   title: 'Flashcard Decks',    desc: 'Spaced-repetition flashcards engineered for maximum knowledge retention.' },
            { icon: 'leaderboard', color: 'var(--color-error)',     title: 'Progress Tracking',  desc: 'Detailed analytics, streak tracking, and skill benchmarks against your peer group.' },
          ].map((f, i) => (
            <div key={f.title} className="bento-card ai-glow-border group p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                   style={{ background: `${f.color}15` }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: f.color, fontVariationSettings: "'FILL' 0" }}>{f.icon}</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3. Why DevPrep AI — side-by-side comparison ═══════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          Why DevPrep AI?
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          See how AI-powered preparation stacks up against the old way.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bento-card p-7 animate-fade-up border" style={{ borderColor: 'var(--color-border-muted)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,82,82,0.15)' }}>
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
          <div className="bento-card p-7 animate-fade-up ai-glow-border" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(108,59,215,0.15)' }}>
                <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>check</span>
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
        </div>
      </section>

      {/* ═══════ 4. Start in Minutes — side-by-side layout ═══════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          Start in minutes
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          Everything you need, right when you open your dashboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bento-card p-7 md:col-span-2 animate-fade-up flex flex-col items-start ai-glow-border">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(108,59,215,0.15)' }}>
              <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>dashboard_customize</span>
            </div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--color-on-surface)' }}>Your personalized dashboard</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--color-on-surface-variant)' }}>
              At a glance: your current streak, upcoming milestones, recommended roadmaps, recent quiz scores,
              and AI tutor suggestions — all tailored to your target role.
            </p>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center" style={{ background: 'var(--color-surface-container)' }}>
                <div className="text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>87%</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>Avg. quiz score</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'var(--color-surface-container)' }}>
                <div className="text-xl font-extrabold" style={{ color: 'var(--color-success)' }}>12</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>Day streak</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'var(--color-surface-container)' }}>
                <div className="text-xl font-extrabold" style={{ color: 'var(--color-warning)' }}>4</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>Roadmaps</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'var(--color-surface-container)' }}>
                <div className="text-xl font-extrabold" style={{ color: 'var(--color-tertiary)' }}>23</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>Code labs</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <div className="bento-card p-5 flex-1 flex flex-col items-start">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(3,218,197,0.15)' }}>
                <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>Track progress</h4>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Skill benchmarks, XP, and weekly growth charts keep you motivated.</p>
            </div>
            <div className="bento-card p-5 flex-1 flex flex-col items-start">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(255,214,0,0.15)' }}>
                <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-warning)', fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>AI at your side</h4>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Ask anything, get instant answers with code examples and explanations.</p>
            </div>
            <div className="bento-card p-5 flex-1 flex flex-col items-start">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(187,134,252,0.15)' }}>
                <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-tertiary)', fontVariationSettings: "'FILL' 1" }}>group</span>
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>Join the community</h4>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Compare scores, share tips, and climb the leaderboard with 50K+ peers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 5. For Everyone ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          Built for every stage of your career
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          Whether you're writing your first for-loop or preparing for Staff Engineer — DevPrep AI meets you where you are.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { icon: 'school',        color: 'var(--color-primary)',   title: 'Students',          desc: 'Build a strong CS foundation with guided curricula and instant AI tutoring for homework and interview prep.' },
            { icon: 'rocket_launch', color: 'var(--color-success)',   title: 'Bootcamp Grads',    desc: 'Fill the gaps bootcamps leave behind. Master DS&A, system design, and ace the technical screen.' },
            { icon: 'code',          color: 'var(--color-warning)',   title: 'Experienced Engineers', desc: 'Level up for senior roles. System design deep-dives, advanced algorithms, and staff-level mock interviews.' },
            { icon: 'switch_access', color: 'var(--color-tertiary)',  title: 'Career Switchers',  desc: 'Transition into tech with a structured path. No fluff — just the skills employers actually ask about.' },
          ].map((p, i) => (
            <div key={p.title} className="bento-card p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                   style={{ background: `${p.color}15` }}>
                <span className="material-symbols-outlined text-xl" style={{ color: p.color, fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>{p.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 6. How It Works ═══════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          How it works
        </h2>
        <p className="text-sm text-center mb-14 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          Four simple steps to interview mastery.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { step: '01', icon: 'person_add', title: 'Create Account', desc: 'Sign up free and set your target companies, role, and experience level.' },
            { step: '02', icon: 'route', title: 'Pick a Roadmap', desc: 'Choose from 40+ curated paths or let AI build a personalized plan.' },
            { step: '03', icon: 'psychology', title: 'Learn & Practice', desc: 'Study with AI tutor, solve coding labs, and take adaptive quizzes daily.' },
            { step: '04', icon: 'work_history', title: 'Crush the Interview', desc: 'Simulate real interviews with company-specific questions and time pressure.' },
          ].map((s, i) => (
            <div key={s.step} className="flex flex-col items-center text-center animate-fade-up relative" style={{ animationDelay: `${i * 120}ms` }}>
              {/* Connector line */}
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
          ))}
        </div>
      </section>

      {/* ═══════ 7. Testimonials ═══════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          Loved by engineers
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          Hear from developers who landed their dream roles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Sarah Chen', role: 'SWE @ Google', avatar: 'S', quote: 'The AI tutor saved me weeks of grinding. Instead of hunting through docs, I just asked and got instant, accurate explanations tailored to my gap.' },
            { name: 'James Park', role: 'SWE @ Stripe', avatar: 'J', quote: 'I failed two onsites before finding this. The company-specific mocks and code labs with AI feedback were the game-changer for my third attempt.' },
            { name: 'Priya Patel', role: 'SWE @ Microsoft', avatar: 'P', quote: 'The adaptive quizzes exposed blind spots I didn\'t even know I had. Three months of daily practice, and I went from mid-tier to FAANG offer.' },
          ].map((t, i) => (
            <div key={t.name} className="bento-card p-6 animate-fade-up flex flex-col" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-warning)', fontVariationSettings: '"FILL" 1' }}>star</span>
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                     style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 8. FAQ ═══════ */}
      <section className="px-6 py-20 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-4 animate-fade-up" style={{ color: 'var(--color-on-surface)' }}>
          Frequently asked questions
        </h2>
        <p className="text-sm text-center mb-12 max-w-lg mx-auto animate-fade-up animation-delay-50" style={{ color: 'var(--color-on-surface-variant)' }}>
          Everything you need to know about DevPrep AI.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bento-card overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left transition-all hover:opacity-80"
                style={{ color: 'var(--color-on-surface)' }}
              >
                <span className="text-sm font-semibold">{faq.q}</span>
                <span className="material-symbols-outlined text-[20px] transition-transform duration-200"
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
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 9. Final CTA ═══════ */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full text-center">
        <div className="bento-card ai-glow-border p-14 animate-fade-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
               style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
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
                    className="px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:border-primary"
                    style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)' }}>
                Try a Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
