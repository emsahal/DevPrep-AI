import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 pointer-events-none"
             style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
             style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent)' }} />

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

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-12 animate-fade-up" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>
          Everything you need to prepare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: 'map',       color: 'var(--color-primary)',   title: 'Guided Roadmaps',    desc: 'Curated learning paths built by senior engineers at top tech companies.' },
            { icon: 'smart_toy', color: 'var(--color-secondary)', title: 'AI Tutor',           desc: 'Get instant explanations, code reviews, and personalized hints from your AI mentor.' },
            { icon: 'data_object', color: 'var(--color-tertiary)', title: 'Live Code Lab',     desc: 'Write, run, and analyze code with real-time AI feedback on complexity and edge cases.' },
            { icon: 'quiz',      color: 'var(--color-success)',   title: 'Adaptive Quizzes',   desc: 'Dynamic assessments that adjust difficulty based on your performance history.' },
            { icon: 'style',     color: 'var(--color-warning)',   title: 'Flashcard Decks',    desc: 'Spaced-repetition flashcards engineered for maximum knowledge retention.' },
            { icon: 'leaderboard', color: 'var(--color-error)',  title: 'Progress Tracking',   desc: 'Detailed analytics, streak tracking, and skill benchmarks against your peer group.' },
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
    </div>
  )
}
