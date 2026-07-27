import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'
import logo from '@/assets/logo.png'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useAuthStore()
  const [error, setError] = useState('')
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const finishAuth = async () => {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const accessToken = params.get('accessToken')
      const refreshToken = params.get('refreshToken')
      const authError = params.get('error')

      if (authError) {
        setError(authError)
        return
      }

      if (!accessToken || !refreshToken) {
        setError('Social sign-in did not return tokens')
        return
      }

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      try {
        const user = await authService.getProfile()
        window.history.replaceState(null, '', '/auth/callback')
        setUser(user)
        setIsAuthenticated(true)
        navigate('/dashboard', { replace: true })
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setError('Unable to finish social sign-in')
      }
    }

    void finishAuth()
  }, [navigate, setIsAuthenticated, setUser])

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base p-unit-4 text-on-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_50%,rgba(139,92,246,0.08),transparent_42%)]" />
      <div className="relative w-full max-w-sm rounded-2xl border border-border-subtle bg-surface-container-lowest p-unit-8 text-center shadow-2xl">
        <Link to="/" className="mb-unit-6 flex items-center justify-center gap-unit-2">
          <img src={logo} alt="DevPrep AI logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold tracking-tight">DevPrep<span className="text-primary">AI</span></span>
        </Link>
        {error ? (
          <>
            <div className="mx-auto mb-unit-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-container/20">
              <span className="material-symbols-outlined text-2xl text-error">error_outline</span>
            </div>
            <h1 className="mb-unit-1 text-xl font-semibold">Sign-in failed</h1>
            <p className="mb-unit-6 text-sm text-on-surface-variant">{error}</p>
            <Link to="/login" className="inline-flex items-center gap-unit-1 rounded-xl bg-primary px-unit-5 py-unit-2 text-sm font-semibold text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-95">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to login
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-unit-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
            <h1 className="mb-unit-1 text-xl font-semibold">Finishing sign-in</h1>
            <p className="text-sm text-on-surface-variant">Redirecting you to the dashboard...</p>
          </>
        )}
      </div>
    </div>
  )
}
