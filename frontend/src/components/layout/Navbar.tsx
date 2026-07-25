import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  BookOpen,
  Brain,
  Code2,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">InterviewPrep</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/learning-paths" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Learning Paths
          </Link>
          <Link to="/library" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Library
          </Link>
          <Link to="/ai-tutor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            AI Tutor
          </Link>
          <Link to="/quizzes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Quizzes
          </Link>
          <Link to="/flashcards" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Flashcards
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link to="/learning-paths" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
              <BookOpen className="h-4 w-4" /> Learning Paths
            </Link>
            <Link to="/library" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
              <Code2 className="h-4 w-4" /> Library
            </Link>
            <Link to="/ai-tutor" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
              <Brain className="h-4 w-4" /> AI Tutor
            </Link>
            <Link to="/quizzes" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
              <GraduationCap className="h-4 w-4" /> Quizzes
            </Link>
            <Link to="/flashcards" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
              <BookOpen className="h-4 w-4" /> Flashcards
            </Link>
            {!isAuthenticated && (
              <>
                <hr className="my-2" />
                <Link to="/login" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  <User className="h-4 w-4" /> Log in
                </Link>
                <Link to="/register" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  <User className="h-4 w-4" /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
