import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">InterviewPrep</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-powered platform for software engineering interview preparation.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Learning</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/learning-paths" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Learning Paths</Link></li>
              <li><Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Technology Library</Link></li>
              <li><Link to="/ai-tutor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Tutor</Link></li>
              <li><Link to="/revision" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Revision</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Practice</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/quizzes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quizzes</Link></li>
              <li><Link to="/flashcards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Flashcards</Link></li>
              <li><Link to="/code-analyzer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Code Analyzer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link></li>
              <li><Link to="/bookmarks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bookmarks</Link></li>
              <li><Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} InterviewPrep. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
