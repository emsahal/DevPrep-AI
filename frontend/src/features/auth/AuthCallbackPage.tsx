import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Loader2 } from 'lucide-react'

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
      <div className="w-full max-w-sm rounded-xl border border-border-subtle bg-surface-container-lowest p-unit-6 text-center shadow-xl">
        {error ? (
          <>
            <h1 className="mb-unit-2 text-xl font-semibold">Sign-in failed</h1>
            <p className="mb-unit-4 text-sm text-on-surface-variant">{error}</p>
            <Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-unit-3 h-6 w-6 animate-spin text-primary" />
            <h1 className="text-xl font-semibold">Finishing sign-in...</h1>
          </>
        )}
      </div>
    </div>
  )
}
