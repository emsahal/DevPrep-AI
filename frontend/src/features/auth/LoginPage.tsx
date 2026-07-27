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
import { SocialAuthButton } from './SocialAuthButton'
import backImage from '@/assets/back.jpg'
import { Bolt, GraduationCap, Loader2, Terminal } from 'lucide-react'
import logo from '@/assets/logo.png'

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
        <Link to="/" className="relative z-10 mb-unit-6 flex items-center gap-unit-2">
          <img src={logo} alt="DevPrep AI logo" className="h-8 w-8 object-contain" />
          <h1 className="text-xl font-bold tracking-tight">DevPrep<span className="text-primary">AI</span></h1>
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-sm lg:mx-0">
          <header className="mb-unit-5">
            <h2 className="mb-unit-1 text-3xl font-bold tracking-tight md:text-4xl">Welcome back.</h2>
            <p className="text-sm text-on-surface-variant">Access your technical growth dashboard.</p>
          </header>

          <div className="mb-unit-5 grid grid-cols-2 gap-unit-3">
            <SocialAuthButton provider="google" label="Google" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-muted bg-surface-container-lowest py-unit-2 text-xs font-medium transition-all hover:border-outline-variant hover:bg-surface-container active:scale-95" />
            <SocialAuthButton provider="github" label="GitHub" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-muted bg-surface-container-lowest py-unit-2 text-xs font-medium transition-all hover:border-outline-variant hover:bg-surface-container active:scale-95" />
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
