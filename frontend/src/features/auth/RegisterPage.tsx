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
import backImage from '@/assets/back.jpg'
import { Bolt, Brain, Loader2, Map, Sparkles, Terminal } from 'lucide-react'

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
    <div className="flex min-h-screen bg-bg-base text-on-surface">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-unit-12 lg:flex">
        <img src={backImage} alt="DevPrep AI neural engineering visual" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-base" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="mb-unit-12 flex items-center gap-unit-2">
            <Terminal className="h-8 w-8 text-primary" />
            <span className="text-heading-md font-bold tracking-tight">DevPrep AI</span>
          </div>
          <h1 className="mb-unit-8 max-w-lg text-display-lg font-bold leading-tight tracking-tight">
            Engineer your <span className="gradient-text">future</span> with AI precision.
          </h1>
          <div className="space-y-unit-6">
            <div className="flex items-start gap-unit-4 rounded-lg border border-transparent p-unit-4 transition-all hover:border-border-subtle hover:bg-surface-container-lowest">
              <div className="rounded-lg bg-primary-container/20 p-unit-2">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-heading-sm font-semibold text-primary">AI-powered analysis</h3>
                <p className="max-w-sm text-body-sm text-on-surface-variant">Deep technical insights into your coding patterns and knowledge gaps.</p>
              </div>
            </div>
            <div className="flex items-start gap-unit-4 rounded-lg border border-transparent p-unit-4 transition-all hover:border-border-subtle hover:bg-surface-container-lowest">
              <div className="rounded-lg bg-secondary-container/20 p-unit-2">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="mb-1 text-heading-sm font-semibold text-secondary">Adaptive quizzes</h3>
                <p className="max-w-sm text-body-sm text-on-surface-variant">Challenges that evolve with your skill level and keep momentum high.</p>
              </div>
            </div>
            <div className="flex items-start gap-unit-4 rounded-lg border border-transparent p-unit-4 transition-all hover:border-border-subtle hover:bg-surface-container-lowest">
              <div className="rounded-lg bg-tertiary-container/20 p-unit-2">
                <Map className="h-5 w-5 text-tertiary" />
              </div>
              <div>
                <h3 className="mb-1 text-heading-sm font-semibold text-tertiary">Career roadmaps</h3>
                <p className="max-w-sm text-body-sm text-on-surface-variant">Strategic pathways designed for senior-level engineering excellence.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 font-code text-label-caps uppercase tracking-widest text-on-surface-variant/60">
          © 2026 DevPrep AI. Engineering Excellence.
        </p>
      </section>

      <section className="relative flex min-h-screen w-full items-center justify-center overflow-y-auto bg-surface-container-lowest p-gutter lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_80%_10%,rgba(208,188,255,0.11),transparent_38%),radial-gradient(480px_circle_at_15%_85%,rgba(76,215,246,0.07),transparent_34%)]" />
        <div className="relative z-10 w-full max-w-md space-y-unit-8 py-unit-12">
          <div className="space-y-unit-2 text-center lg:text-left">
            <h2 className="text-heading-md font-semibold tracking-tight">Create an account</h2>
            <p className="text-body-sm text-on-surface-variant">Start your technical mastery journey today.</p>
          </div>

          <div className="grid grid-cols-2 gap-unit-4">
            <button type="button" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-subtle bg-surface-raised px-unit-4 py-unit-3 text-body-sm font-semibold transition-all hover:bg-surface-container active:scale-95">
              <span className="text-base font-bold">G</span>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-unit-2 rounded-lg border border-border-subtle bg-surface-raised px-unit-4 py-unit-3 text-body-sm font-semibold transition-all hover:bg-surface-container active:scale-95">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.91c-2.78.62-3.37-1.22-3.37-1.22-.45-1.2-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 6.94c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.13 10.13 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="relative py-unit-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-lowest px-unit-2 font-code text-label-caps uppercase tracking-widest text-on-surface-variant">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-unit-4">
            {error && (
              <div className="rounded-lg border border-error/30 bg-error-container/20 p-unit-3 text-body-sm text-on-error-container">
                {error}
              </div>
            )}
            <div className="space-y-unit-1">
              <Label htmlFor="name" className="px-unit-1 font-code text-label-caps uppercase tracking-widest text-on-surface-variant">Full Name</Label>
              <Input id="name" placeholder="Engineering Architect" className="h-12 rounded-lg border-border-subtle bg-surface-raised px-unit-4 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('name')} />
              {errors.name && <p className="text-body-sm text-error">{errors.name.message}</p>}
            </div>
            <div className="space-y-unit-1">
              <Label htmlFor="email" className="px-unit-1 font-code text-label-caps uppercase tracking-widest text-on-surface-variant">Email Address</Label>
              <Input id="email" type="email" placeholder="dev@prep-ai.io" className="h-12 rounded-lg border-border-subtle bg-surface-raised px-unit-4 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('email')} />
              {errors.email && <p className="text-body-sm text-error">{errors.email.message}</p>}
            </div>
            <div className="space-y-unit-1">
              <Label htmlFor="password" className="px-unit-1 font-code text-label-caps uppercase tracking-widest text-on-surface-variant">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-12 rounded-lg border-border-subtle bg-surface-raised px-unit-4 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('password')} />
              {errors.password && <p className="text-body-sm text-error">{errors.password.message}</p>}
            </div>
            <div className="space-y-unit-1">
              <Label htmlFor="confirmPassword" className="px-unit-1 font-code text-label-caps uppercase tracking-widest text-on-surface-variant">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-12 rounded-lg border-border-subtle bg-surface-raised px-unit-4 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-offset-bg-base" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-body-sm text-error">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="mt-unit-4 h-13 w-full rounded-lg bg-primary py-unit-4 text-heading-sm font-semibold text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Initialize Account
              {!isSubmitting ? <Bolt className="ml-2 h-4 w-4" /> : null}
            </Button>
          </form>

          <div className="border-t border-border-subtle pt-unit-4 text-center">
            <p className="text-body-sm text-on-surface-variant">
              Already part of the network?{' '}
              <Link to="/login" className="font-semibold text-primary transition-all hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
