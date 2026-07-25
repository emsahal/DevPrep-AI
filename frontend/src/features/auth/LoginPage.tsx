import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { GoogleAuthButton } from './GoogleAuthButton'
import backImage from '@/assets/back.jpg'
import { Bolt, GraduationCap, Loader2, Terminal } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useAuthStore()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      const result = await authService.login(data)
      setUser(result.user)
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base text-on-surface">
      <section className="relative hidden w-1/2 overflow-hidden border-r border-border-subtle lg:flex lg:items-center lg:justify-center">
        <img src={backImage} alt="DevPrep AI engineering workspace" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-base/30" />
        <div className="glass-panel relative z-10 mx-unit-8 max-w-md rounded-xl p-unit-6 shadow-2xl">
          <div className="mb-unit-3 flex items-center gap-unit-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-code text-[10px] uppercase tracking-widest text-primary">Engineering Excellence</span>
          </div>
          <blockquote className="mb-unit-5 text-xl font-semibold leading-tight tracking-tight">
            "DevPrep AI sharpens how you think through scalable systems, code quality, and interview pressure."
          </blockquote>
          <div className="flex items-center gap-unit-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border-muted bg-surface-container-highest">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Technical mastery</p>
              <p className="text-xs text-on-surface-variant">Built for serious interview prep</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex h-screen w-full flex-col justify-center overflow-hidden bg-surface-container-lowest px-gutter py-unit-6 md:px-unit-10 lg:w-1/2 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_70%_20%,rgba(139,92,246,0.12),transparent_42%),radial-gradient(500px_circle_at_10%_90%,rgba(76,215,246,0.06),transparent_35%)]" />
        <div className="relative z-10 mb-unit-6 flex items-center gap-unit-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary shadow-lg shadow-primary/10">
            <Bolt className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">DevPrep AI</h1>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-sm lg:mx-0">
          <header className="mb-unit-5">
            <h2 className="mb-unit-1 text-3xl font-bold tracking-tight md:text-4xl">Welcome back.</h2>
            <p className="text-sm text-on-surface-variant">Access your technical growth dashboard.</p>
          </header>

          <div className="mb-unit-5 grid grid-cols-2 gap-unit-3">
            <GoogleAuthButton text="signin_with" onError={setError} />
            <button type="button" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-muted bg-surface-container-lowest py-unit-2 text-xs font-medium transition-all hover:border-outline-variant hover:bg-surface-container active:scale-95">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.91c-2.78.62-3.37-1.22-3.37-1.22-.45-1.2-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 6.94c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.13 10.13 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="relative mb-unit-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-muted" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-lowest px-unit-3 font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-unit-4">
            {error && (
              <div className="rounded-lg border border-error/30 bg-error-container/20 p-unit-2 text-xs text-on-error-container">
                {error}
              </div>
            )}
            <div className="space-y-unit-1">
              <Label htmlFor="email" className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Email Address</Label>
              <Input id="email" type="email" placeholder="dev@excellence.ai" className="h-10 rounded-lg border-border-muted bg-surface-container-lowest px-unit-3 text-sm text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('email')} />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>
            <div className="space-y-unit-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary transition-colors hover:text-primary-container">Forgot password?</Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="h-10 rounded-lg border-border-muted bg-surface-container-lowest px-unit-3 text-sm text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('password')} />
              {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
            </div>
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-3.5 w-3.5 rounded border-border-muted bg-surface-container-lowest text-primary focus:ring-primary" />
              <Label htmlFor="remember" className="ml-unit-2 text-xs text-on-surface-variant">Remember for 30 days</Label>
            </div>
            <Button type="submit" className="h-10 w-full rounded-lg bg-primary py-unit-2 text-sm font-semibold text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
              {!isSubmitting ? <Bolt className="ml-2 h-4 w-4" /> : null}
            </Button>
          </form>

          <footer className="mt-unit-5 border-t border-border-muted pt-unit-5 text-center">
            <p className="text-xs text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary transition-colors hover:text-primary-container">Sign up for free</Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}
