import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/providers/ToastProvider'

const FEATURES = [
  {
    icon: 'quiz',
    title: '1v1 Quiz Battles',
    desc: 'Compete face-to-face against other learners solving AI-generated questions in real-time. Speed and accuracy determine the winner!',
    details: 'Custom topics, customizable question counts, and instant rating changes.',
  },
  {
    icon: 'code',
    title: 'Coding Speedruns',
    desc: 'Solve coding challenges side-by-side. Run tests, debug, and submit your code to see who completes the logic first.',
    details: 'Languages supported: JavaScript, Python, TypeScript, and SQL.',
  },
  {
    icon: 'style',
    title: 'Flashcard Sprints',
    desc: 'Race against the clock to master terms and concepts. Fast recall wins you extra bonus points and exclusive badges.',
    details: 'Leverages spaced repetition cards with active recall gameplay.',
  },
]

export function DuelPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({ type: 'warning', title: 'Email required', message: 'Please enter a valid email address.' })
      return
    }
    setSubscribed(true)
    toast({ type: 'success', title: 'Notifications Enabled!', message: "We'll let you know the second Duels goes live!" })
  }

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto flex flex-col justify-center min-h-[85vh]">
      {/* Hero section */}
      <div className="text-center mb-12 max-w-2xl mx-auto animate-fade-up">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Feature Release: Version 2.0
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>
          Study Duels
        </h1>
        <p className="text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
          A real-time multiplayer arena designed to test your knowledge, speed, and coding skills against software developers around the globe.
        </p>
      </div>

      {/* Grid of upcoming features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {FEATURES.map((feat, i) => (
          <div
            key={feat.title}
            className="bento-card p-6 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                   style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{feat.title}</h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{feat.desc}</p>
            </div>
            <div className="text-xs font-medium pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)', color: 'var(--color-outline)' }}>
              {feat.details}
            </div>
          </div>
        ))}
      </div>

      {/* Glassmorphic Call to Action */}
      <div className="bento-card p-8 text-center max-w-xl mx-auto w-full animate-fade-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Get Early Access</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
          Want to be among the first to test real-time battles? Sign up to receive beta testing invites.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
               style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>
            <span className="material-symbols-outlined text-xl">check_circle</span>
            You're on the list! We will email you beta invites.
          </div>
        ) : (
          <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', border: '1px solid var(--color-border-subtle)' }}
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Notify Me
            </button>
          </form>
        )}
      </div>

      {/* Navigation footer */}
      <div className="text-center mt-10 animate-fade-up" style={{ animationDelay: '400ms' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
          style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
