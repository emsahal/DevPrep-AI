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
import { Bolt, Brain, Loader2, Map, Sparkles } from 'lucide-react'
import logo from '@/assets/logo.png'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useAuthStore()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('')
      const result = await authService.register(data)
      setUser(result.user)
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base text-on-surface">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-unit-8 lg:flex">
        <img src={backImage} alt="DevPrep AI neural engineering visual" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-base" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />

        <div className="relative z-10">
          <Link to="/" className="mb-unit-6 flex items-center gap-unit-2">
            <img src={logo} alt="DevPrep AI logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight">DevPrep<span className="text-primary">AI</span></span>
          </Link>
          <h1 className="mb-unit-5 max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Engineer your <span className="gradient-text">future</span> with AI precision.
          </h1>
          <div className="space-y-unit-2">
            <div className="flex items-start gap-unit-3 rounded-lg border border-transparent p-unit-3 transition-all hover:border-border-subtle hover:bg-surface-container-lowest">
              <div className="rounded-lg bg-primary-container/20 p-1.5">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary">AI-powered analysis</h3>
                <p className="max-w-sm text-xs text-on-surface-variant">Deep insights into coding patterns and knowledge gaps.</p>
              </div>
            </div>
            <div className="flex items-start gap-unit-3 rounded-lg border border-transparent p-unit-3 transition-all hover:border-border-subtle hover:bg-surface-container-lowest">
              <div className="rounded-lg bg-secondary-container/20 p-1.5">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-secondary">Adaptive quizzes</h3>
                <p className="max-w-sm text-xs text-on-surface-variant">Challenges that evolve with your skill level.</p>
              </div>
            </div>
            <div className="flex items-start gap-unit-3 rounded-lg border border-transparent p-unit-3 transition-all hover:border-border-subtle hover:bg-surface-container-lowest">
              <div className="rounded-lg bg-tertiary-container/20 p-1.5">
                <Map className="h-4 w-4 text-tertiary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-tertiary">Career roadmaps</h3>
                <p className="max-w-sm text-xs text-on-surface-variant">Strategic pathways for engineering excellence.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 font-code text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          © 2026 DevPrep AI. Engineering Excellence.
        </p>
      </section>

      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-surface-container-lowest p-unit-4 lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_80%_10%,rgba(208,188,255,0.11),transparent_38%),radial-gradient(480px_circle_at_15%_85%,rgba(76,215,246,0.07),transparent_34%)]" />
        <div className="relative z-10 w-full max-w-sm space-y-unit-3">
          <div className="space-y-unit-1 text-center lg:text-left">
            <h2 className="text-xl font-semibold tracking-tight">Create an account</h2>
            <p className="text-xs text-on-surface-variant">Start your technical mastery journey today.</p>
          </div>

          <div className="grid grid-cols-2 gap-unit-2">
            <SocialAuthButton provider="google" label="Google" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-subtle bg-surface-raised px-unit-3 py-1.5 text-xs font-semibold transition-all hover:bg-surface-container active:scale-95" />
            <SocialAuthButton provider="github" label="GitHub" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-subtle bg-surface-raised px-unit-3 py-1.5 text-xs font-semibold transition-all hover:bg-surface-container active:scale-95" />
          </div>

          <div className="relative py-unit-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-lowest px-unit-2 font-code text-[10px] uppercase tracking-widest text-on-surface-variant">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-unit-2">
            {error && (
              <div className="rounded-lg border border-error/30 bg-error-container/20 p-unit-2 text-xs text-on-error-container">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="name" className="px-unit-1 font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Full Name</Label>
              <Input id="name" placeholder="Engineering Architect" className="h-9 rounded-lg border-border-subtle bg-surface-raised px-unit-3 text-sm text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('name')} />
              {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="px-unit-1 font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Email Address</Label>
              <Input id="email" type="email" placeholder="dev@prep-ai.io" className="h-9 rounded-lg border-border-subtle bg-surface-raised px-unit-3 text-sm text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('email')} />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="px-unit-1 font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-9 rounded-lg border-border-subtle bg-surface-raised px-unit-3 text-sm text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('password')} />
              {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="px-unit-1 font-code text-[10px] uppercase tracking-widest text-on-surface-variant">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-9 rounded-lg border-border-subtle bg-surface-raised px-unit-3 text-sm text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="mt-unit-2 h-10 w-full rounded-lg bg-primary py-unit-2 text-sm font-semibold text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Initialize Account
              {!isSubmitting ? <Bolt className="ml-2 h-4 w-4" /> : null}
            </Button>
          </form>

          <div className="border-t border-border-subtle pt-unit-3 text-center">
            <p className="text-xs text-on-surface-variant">
              Already part of the network?{' '}
              <Link to="/login" className="font-semibold text-primary transition-all hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
