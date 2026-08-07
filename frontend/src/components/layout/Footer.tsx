import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-base)' }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold shadow-md"
                   style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                D
              </div>
              <span className="text-lg tracking-tight" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                DevPrep <span style={{ color: 'var(--color-primary)' }}>AI</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
              AI-powered platform for software engineering interview preparation, developer roadmaps, and coding practice.
            </p>
            <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
              Start Free Trial <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Learning Column */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--color-outline)' }}>Learning</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/learning-paths" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Developer Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Technology Library
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Engineering Blogs
                </Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  AI Tutor
                </Link>
              </li>
              <li>
                <Link to="/revision" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Revision Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice Column */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--color-outline)' }}>Practice</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/quizzes" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Quizzes & Tests
                </Link>
              </li>
              <li>
                <Link to="/flashcards" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Interactive Flashcards
                </Link>
              </li>
              <li>
                <Link to="/code-analyzer" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Coding Practice
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Interview Questions
                </Link>
              </li>
              <li>
                <Link to="/resume-optimizer" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Resume Optimizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Community Column */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--color-outline)' }}>Account</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/leaderboard" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Profile & Stats
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm transition-colors hover:text-primary font-semibold" style={{ color: 'var(--color-primary)' }}>
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
             style={{ borderTop: '1px solid var(--color-border-subtle)', color: 'var(--color-outline)' }}>
          <div>
            &copy; {new Date().getFullYear()} DevPrep AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/learning-paths" className="hover:text-primary transition-colors">Roadmaps</Link>
            <Link to="/blogs" className="hover:text-primary transition-colors">Articles</Link>
            <Link to="/interview-prep" className="hover:text-primary transition-colors">Interview Prep</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
