import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

type GoogleButtonText = 'signin_with' | 'signup_with'

interface GoogleAuthButtonProps {
  text: GoogleButtonText
  onError: (message: string) => void
}

interface GoogleCredentialResponse {
  credential?: string
}

interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
      }) => void
      renderButton: (
        parent: HTMLElement,
        options: {
          theme: 'outline'
          size: 'large'
          type: 'standard'
          text: GoogleButtonText
          shape: 'rectangular'
          width: number
        }
      ) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleAccounts
  }
}

let googleScriptPromise: Promise<void> | null = null

function loadGoogleScript() {
  if (window.google?.accounts.id) return Promise.resolve()
  if (googleScriptPromise) return googleScriptPromise

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Google sign-in')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load Google sign-in'))
    document.head.appendChild(script)
  })

  return googleScriptPromise
}

export function GoogleAuthButton({ text, onError }: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useAuthStore()

  const handleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      onError('')
      if (!response.credential) {
        throw new Error('Google did not return a sign-in credential')
      }

      const result = await authService.googleSignIn(response.credential)
      setUser(result.user)
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Google sign-in failed')
    }
  }, [navigate, onError, setIsAuthenticated, setUser])

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      onError('Google sign-in is not configured')
      return
    }

    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google?.accounts.id) return

        containerRef.current.innerHTML = ''
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text,
          shape: 'rectangular',
          width: 180,
        })
      })
      .catch((error: unknown) => {
        onError(error instanceof Error ? error.message : 'Unable to load Google sign-in')
      })

    return () => {
      cancelled = true
    }
  }, [handleCredential, onError, text])

  return <div ref={containerRef} className="flex min-h-10 justify-center overflow-hidden rounded-lg" />
}
