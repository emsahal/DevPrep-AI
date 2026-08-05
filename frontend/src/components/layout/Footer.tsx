import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-base)' }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                   style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                D
              </div>
              <span className="text-base tracking-tight" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                DevPrep
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
              AI-powered platform for software engineering interview preparation.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'var(--color-outline)' }}>Learning</h3>
            <ul className="space-y-2.5">
              {['Learning Paths', 'Technology Library', 'AI Tutor', 'Revision'].map((l) => (
                <li key={l}>
                  <Link to="#" className="text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--color-on-surface-variant)' }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'var(--color-outline)' }}>Practice</h3>
            <ul className="space-y-2.5">
              {['Quizzes', 'Flashcards', 'Code Analyzer', 'Mock Interviews'].map((l) => (
                <li key={l}>
                  <Link to="#" className="text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--color-on-surface-variant)' }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'var(--color-outline)' }}>Account</h3>
            <ul className="space-y-2.5">
              {['Profile', 'Bookmarks', 'Settings', 'Leaderboard'].map((l) => (
                <li key={l}>
                  <Link to="#" className="text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--color-on-surface-variant)' }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 text-center text-xs"
             style={{ borderTop: '1px solid var(--color-border-subtle)', color: 'var(--color-outline)' }}>
          &copy; {new Date().getFullYear()} DevPrep. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
