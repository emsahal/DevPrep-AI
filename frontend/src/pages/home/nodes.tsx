import { Link } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'

const faqs = [
  { q: 'Is DevPrep AI free to use?', a: 'Yes, we offer a generous free tier with access to roadmaps, quizzes, and limited AI tutor sessions. Premium plans unlock unlimited AI interactions, advanced code labs, and priority support.' },
  { q: 'How does the AI tutor work?', a: 'Our AI tutor uses GPT-4o to provide real-time explanations, code reviews, and hints. You can ask questions about any topic, get code walkthroughs, or request personalized study plans.' },
  { q: 'What topics are covered?', a: 'From data structures and algorithms to system design, frontend frameworks, and DevOps — we cover 40+ technologies with 500+ hours of curated content updated quarterly.' },
  { q: 'Can I practice company-specific questions?', a: 'Absolutely. Our platform includes curated question banks from top tech companies (FAANG, fintech, startups) with company-specific mock interviews and grading rubrics.' },
  { q: 'How are quizzes and roadmaps created?', a: 'Content is crafted by senior engineers from top companies and refined by AI. Each question includes detailed explanations, and roadmaps adapt to your progress automatically.' },
]

function NodeShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bento-card ai-glow-border p-8 animate-fade-up ${className}`}
         style={{ minWidth: 320, maxWidth: 820, background: 'var(--color-surface-container-lowest)' }}>
      {children}
    </div>
  )
}

export function HeroNode({ }: NodeProps) {
  return (
    <div className="relative text-center px-10 py-14" style={{ width: 680 }}>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
           style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }} />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
           style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent)' }} />
      <div className="relative z-10">
        <svg className="absolute -top-8 -left-8 w-16 h-16 opacity-20" viewBox="0 0 64 64" fill="none">
          <path d="M32 2L40 22L62 24L44 38L50 60L32 48L14 60L20 38L2 24L24 22L32 2Z" fill="var(--color-primary)" />
        </svg>
        <svg className="absolute -bottom-8 -right-8 w-20 h-20 opacity-10" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="var(--color-secondary)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
          <circle cx="40" cy="40" r="20" stroke="var(--color-secondary)" strokeWidth="1" opacity="0.5" fill="none" />
        </svg>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
             style={{ background: 'rgba(208,188,255,0.1)', border: '1px solid rgba(208,188,255,0.25)', color: 'var(--color-primary)' }}>
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          Powered by GPT-4o · 50,000+ developers
        </div>
        <h1 className="font-extrabold mb-5 leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'var(--color-on-surface)' }}>
          Ace Your Technical<br />
          <span style={{ color: 'var(--color-primary)' }}>Interview</span> with AI
        </h1>
        <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--color-on-surface-variant)' }}>
          Structured roadmaps, AI-powered coding labs, and a personal tutor that adapts to your skill level.
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
    </div>
  )
}

export function FeaturesNode({ }: NodeProps) {
  const features = [
    { icon: 'map',         color: 'var(--color-primary)',   title: 'Guided Roadmaps',    desc: 'Curated learning paths built by senior engineers at top tech companies.' },
    { icon: 'smart_toy',   color: 'var(--color-secondary)', title: 'AI Tutor',           desc: 'Get instant explanations, code reviews, and personalized hints from your AI mentor.' },
    { icon: 'data_object', color: 'var(--color-tertiary)',  title: 'Live Code Lab',      desc: 'Write, run, and analyze code with real-time AI feedback on complexity and edge cases.' },
    { icon: 'quiz',        color: 'var(--color-success)',   title: 'Adaptive Quizzes',   desc: 'Dynamic assessments that adjust difficulty based on your performance history.' },
    { icon: 'style',       color: 'var(--color-warning)',   title: 'Flashcard Decks',    desc: 'Spaced-repetition flashcards engineered for maximum knowledge retention.' },
    { icon: 'leaderboard', color: 'var(--color-error)',     title: 'Progress Tracking',  desc: 'Detailed analytics, streak tracking, and skill benchmarks against your peer group.' },
  ]
  return (
    <NodeShell>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
          Everything you need to prepare
        </h2>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>
          Six integrated tools that work together to take you from zero to interview-ready.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="group p-4 rounded-xl transition-all hover:scale-[1.02]"
               style={{ background: 'var(--color-surface-container)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                 style={{ background: `${f.color}15` }}>
              <span className="material-symbols-outlined text-xl" style={{ color: f.color, fontVariationSettings: "'FILL' 0" }}>{f.icon}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>{f.title}</h3>
            <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
    </NodeShell>
  )
}

export function WhyNode({ }: NodeProps) {
  return (
    <NodeShell>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>Why DevPrep AI?</h2>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>AI-powered prep vs the old way</p>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 p-5 rounded-xl border" style={{ borderColor: 'var(--color-border-muted)', background: 'var(--color-surface-container)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-error)', fontVariationSettings: "'FILL' 1" }}>close</span>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>Traditional</h3>
          </div>
          <ul className="space-y-2">
            {['Scattered resources', 'No code feedback', 'Static study plans'].map(item => (
              <li key={item} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined text-xs" style={{ color: 'var(--color-error)', fontVariationSettings: "'FILL' 1" }}>close_small</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-5 rounded-xl ai-glow-border" style={{ background: 'var(--color-surface-container)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>check</span>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>DevPrep AI</h3>
          </div>
          <ul className="space-y-2">
            {['All-in-one platform', 'Real-time AI feedback', 'Adaptive plans'].map(item => (
              <li key={item} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                <span className="material-symbols-outlined text-xs" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>check_small</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
    </NodeShell>
  )
}

export function AudienceNode({ }: NodeProps) {
  const audiences = [
    { icon: 'school',        color: 'var(--color-primary)',   title: 'Students',          desc: 'Build a strong CS foundation with guided curricula and instant AI tutoring.' },
    { icon: 'rocket_launch', color: 'var(--color-success)',   title: 'Bootcamp Grads',    desc: 'Fill the gaps bootcamps leave behind. Master DS&A and system design.' },
    { icon: 'code',          color: 'var(--color-warning)',   title: 'Experienced',       desc: 'Level up for senior roles with system design deep-dives and mock interviews.' },
    { icon: 'switch_access', color: 'var(--color-tertiary)',  title: 'Career Switchers',  desc: 'Transition into tech with a structured path — just the skills employers ask about.' },
  ]
  return (
    <NodeShell>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>Built for every stage</h2>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>DevPrep AI meets you where you are.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {audiences.map((a) => (
          <div key={a.title} className="p-4 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${a.color}15` }}>
              <span className="material-symbols-outlined text-lg" style={{ color: a.color, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>{a.title}</h3>
            <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{a.desc}</p>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
    </NodeShell>
  )
}

export function HowNode({ }: NodeProps) {
  const steps = [
    { step: '01', icon: 'person_add',    title: 'Create Account', desc: 'Sign up free and set your target companies and role.' },
    { step: '02', icon: 'route',         title: 'Pick a Roadmap', desc: 'Choose from 40+ curated paths or let AI build one.' },
    { step: '03', icon: 'psychology',    title: 'Learn & Practice', desc: 'Study with AI tutor, solve coding labs, and take quizzes.' },
    { step: '04', icon: 'work_history',  title: 'Crush the Interview', desc: 'Simulate real interviews with company-specific questions.' },
  ]
  return (
    <NodeShell>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>How it works</h2>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Four simple steps to interview mastery.</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <div key={s.step} className="flex flex-col items-center text-center relative">
            {i < 3 && (
              <div className="absolute top-6 left-[55%] w-[calc(100%-20px)] h-[1px]"
                   style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }} />
            )}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 relative z-10"
                 style={{ background: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-muted)' }}>
              <span className="material-symbols-outlined text-lg" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
            <div className="text-[10px] font-bold mb-1 px-2 py-0.5 rounded-full"
                 style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
              {s.step}
            </div>
            <h3 className="font-semibold text-xs mb-1" style={{ color: 'var(--color-on-surface)' }}>{s.title}</h3>
            <p className="text-[10px] leading-tight" style={{ color: 'var(--color-on-surface-variant)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
    </NodeShell>
  )
}

export function TestimonialNode({ }: NodeProps) {
  const testimonials = [
    { name: 'Sarah Chen', role: 'SWE @ Google', initial: 'S', quote: 'The AI tutor saved me weeks of grinding. Instead of hunting through docs, I just asked and got instant, accurate explanations.' },
    { name: 'James Park', role: 'SWE @ Stripe', initial: 'J', quote: 'The company-specific mocks and code labs with AI feedback were the game-changer for my third attempt.' },
    { name: 'Priya Patel', role: 'SWE @ Microsoft', initial: 'P', quote: 'The adaptive quizzes exposed blind spots I didn\'t even know I had. Three months of daily practice, and I went from mid-tier to FAANG.' },
  ]
  return (
    <NodeShell>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>Loved by engineers</h2>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Hear from developers who landed their dream roles.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.name} className="p-4 rounded-xl flex flex-col" style={{ background: 'var(--color-surface-container)' }}>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, j) => (
                <span key={j} className="material-symbols-outlined text-xs" style={{ color: 'var(--color-warning)', fontVariationSettings: '"FILL" 1' }}>star</span>
              ))}
            </div>
            <p className="text-xs mb-3 flex-1 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>"{t.quote}"</p>
            <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                   style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                {t.initial}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{t.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
    </NodeShell>
  )
}

export function FaqNode({ }: NodeProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <NodeShell>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>FAQs</h2>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Everything you need to know.</p>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-3 text-left transition-all hover:opacity-80"
              style={{ color: 'var(--color-on-surface)' }}
            >
              <span className="text-xs font-semibold">{faq.q}</span>
              <span className="material-symbols-outlined text-base transition-transform duration-200"
                    style={{
                      color: 'var(--color-primary)',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      fontVariationSettings: "'FILL' 1",
                    }}>
                expand_more
              </span>
            </button>
            <div className="overflow-hidden transition-all duration-300"
                 style={{ maxHeight: openFaq === i ? '120px' : '0px' }}>
              <div className="px-3 pb-3 text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
    </NodeShell>
  )
}

export function CtaNode({ }: NodeProps) {
  return (
    <NodeShell className="text-center relative overflow-hidden">
      <Handle type="target" position={Position.Top} style={{ background: 'var(--color-primary)', width: 12, height: 12, border: '2px solid var(--color-bg-base)' }} />
      <svg className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none" viewBox="0 0 160 160" fill="none">
        <circle cx="120" cy="40" r="80" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="8 6" fill="none" />
        <circle cx="120" cy="40" r="50" stroke="var(--color-secondary)" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="relative z-10">
        <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--color-on-surface)' }}>
          Ready to ace your interview?
        </h2>
        <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
          Join 50,000+ developers already preparing smarter with DevPrep AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link to="/register"
                className="px-7 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            Create Free Account →
          </Link>
          <Link to="/quizzes"
                className="px-7 py-3 rounded-xl font-bold text-sm transition-all hover:border-primary"
                style={{ border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface-variant)' }}>
            Try a Quiz
          </Link>
        </div>
      </div>
    </NodeShell>
  )
}