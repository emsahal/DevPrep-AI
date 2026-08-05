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
import { Loader2 } from 'lucide-react'
import BlurText from '@/components/ui/BlurText'
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
    <div className="h-screen w-full flex overflow-hidden font-sans selection:bg-white/30 selection:text-zinc-950 relative" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* ═══════ Fixed Top-Left Logo Badge ═══════ */}
      <div className="fixed top-6 left-6 sm:top-8 sm:left-8 z-50">
        <Link to="/" className="inline-flex items-center gap-2.5 group bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-zinc-800/80 shadow-lg transition-all hover:bg-zinc-800 hover:border-zinc-700">
          <img src={logo} alt="DevPrep logo" className="h-6 w-6 object-contain group-hover:scale-105 transition-transform" />
          <span className="text-base font-bold tracking-tight text-white">
            DevPrep
          </span>
        </Link>
      </div>

      {/* ═══════ Section 1: LEFT SECTION (Showcase Section - Rich Dark #12131a) ═══════ */}
      <section className="hidden lg:flex w-1/2 flex-col justify-between p-8 sm:p-10 xl:p-14 bg-[#12131a] text-white border-r border-zinc-800/80 h-full overflow-hidden">
        <div className="h-4" />

        {/* Middle Showcase Content */}
        <div className="my-auto max-w-md mx-auto space-y-5 text-left w-full">
          <div>
            <BlurText
              text="Consistency beats intensity. Every problem you solve today compounds into the engineer you become tomorrow."
              delay={60}
              animateBy="words"
              direction="top"
              stepDuration={0.25}
              className="font-medium text-2xl sm:text-3xl lg:text-[32px] max-w-md leading-[1.2] tracking-[-0.03em] justify-start text-white"
            />
          </div>

          <div className="w-full flex justify-center pt-1">
            <svg className="w-80 h-52 text-purple-400" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="330" height="210" rx="14" fill="#18181b" stroke="#27272a" strokeWidth="2" />
              <rect x="5" y="5" width="330" height="32" rx="14" fill="#27272a" />
              <circle cx="24" cy="21" r="4.5" fill="#ef4444" />
              <circle cx="38" cy="21" r="4.5" fill="#f59e0b" />
              <circle cx="52" cy="21" r="4.5" fill="#10b981" />
              <text x="72" y="25" fill="#a1a1aa" fontSize="10.5" fontWeight="bold" fontFamily="monospace">two_sum_optimized.py</text>
              <rect x="250" y="13" width="75" height="16" rx="4" fill="#3f3f46" />
              <text x="260" y="25" fill="#34d399" fontSize="8.5" fontWeight="bold" fontFamily="monospace">Python 3.11</text>

              <text x="18" y="52" fill="#52525b" fontSize="9" fontFamily="monospace">1</text>
              <text x="35" y="52" fill="#c084fc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">def</text>
              <text x="60" y="52" fill="#60a5fa" fontSize="9.5" fontWeight="bold" fontFamily="monospace">two_sum</text>
              <text x="105" y="52" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">(nums, target):</text>

              <text x="18" y="68" fill="#52525b" fontSize="9" fontFamily="monospace">2</text>
              <text x="50" y="68" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">seen = {}</text>

              <text x="18" y="84" fill="#52525b" fontSize="9" fontFamily="monospace">3</text>
              <text x="50" y="84" fill="#c084fc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">for</text>
              <text x="72" y="84" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">i, num </text>
              <text x="112" y="84" fill="#c084fc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">in</text>
              <text x="126" y="84" fill="#38bdf8" fontSize="9.5" fontFamily="monospace">enumerate</text>
              <text x="185" y="84" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">(nums):</text>

              <text x="18" y="100" fill="#52525b" fontSize="9" fontFamily="monospace">4</text>
              <text x="65" y="100" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">diff = target - num</text>

              <text x="18" y="116" fill="#52525b" fontSize="9" fontFamily="monospace">5</text>
              <text x="65" y="116" fill="#c084fc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">if</text>
              <text x="80" y="116" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">diff </text>
              <text x="105" y="116" fill="#c084fc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">in</text>
              <text x="120" y="116" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">seen:</text>

              <text x="18" y="132" fill="#52525b" fontSize="9" fontFamily="monospace">6</text>
              <text x="80" y="132" fill="#c084fc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">return</text>
              <text x="120" y="132" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">[seen[diff], i]</text>

              <text x="18" y="148" fill="#52525b" fontSize="9" fontFamily="monospace">7</text>
              <text x="65" y="148" fill="#e4e4e7" fontSize="9.5" fontFamily="monospace">seen[num] = i</text>

              <rect x="160" y="150" width="165" height="52" rx="8" fill="#27272a" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="178" cy="176" r="9" fill="#34d399" fillOpacity="0.2" />
              <path d="M178 171L179.5 174.5L183 176L179.5 177.5L178 181L176.5 177.5L173 176L176.5 174.5Z" fill="#34d399" />
              <text x="194" y="172" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">AI Optimization Check</text>
              <text x="194" y="185" fill="#34d399" fontSize="8.5" fontFamily="sans-serif">Time O(N) • Space O(N) Optimal</text>
            </svg>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          © 2026 DevPrep. Engineering Excellence.
        </div>
      </section>

      {/* ═══════ Section 2: RIGHT SECTION (Form Section - Solid Deep Dark #09090b) ═══════ */}
      <section className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-8 bg-[#09090b] text-white h-full overflow-hidden">
        <div className="h-4" />

        {/* Extra Compact Form Container */}
        <div className="my-auto max-w-[300px] w-full mx-auto">
          <header className="mb-3.5">
            {/* Compact Segmented Auth Switcher */}
            <div className="w-full flex rounded-lg bg-zinc-900 p-1 border border-zinc-800 mb-3.5">
              <Link to="/login" className="flex-1 py-1.5 text-xs font-bold text-center rounded-md bg-white text-zinc-950 shadow-sm transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="flex-1 py-1.5 text-xs font-semibold text-center rounded-md text-zinc-400 hover:text-white transition-colors">
                Register
              </Link>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sign in to continue your technical preparation
            </p>
          </header>

          {/* Compact Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3.5">
            <SocialAuthButton provider="google" label="Google" className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-95" />
            <SocialAuthButton provider="github" label="GitHub" className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-95" />
          </div>

          {/* Divider */}
          <div className="relative mb-3.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest text-zinc-500">
              <span className="bg-[#09090b] px-2">or email</span>
            </div>
          </div>

          {/* Compact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-0.5">
              <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-8.5 rounded-lg border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder:text-zinc-600 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white"
                {...register('email')}
              />
              {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Password</Label>
                <Link to="/forgot-password" className="text-[11px] text-zinc-400 hover:text-white transition-colors font-medium underline underline-offset-2">Forgot password?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-8.5 rounded-lg border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder:text-zinc-600 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white"
                {...register('password')}
              />
              {errors.password && <p className="text-[11px] text-rose-400">{errors.password.message}</p>}
            </div>

            <div className="flex items-center py-0.5">
              <input id="remember" type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-800 bg-zinc-900 text-white focus:ring-white" />
              <Label htmlFor="remember" className="ml-2 text-[11px] text-zinc-400 cursor-pointer font-medium">Remember for 30 days</Label>
            </div>

            {/* WHITE SUBMIT BUTTON WITHOUT ICON */}
            <Button
              type="submit"
              className="h-9 w-full rounded-lg font-bold text-xs text-zinc-950 bg-white hover:bg-zinc-200 transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-zinc-950" /> : null}
              <span>Sign In</span>
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-3.5 text-center">
            <p className="text-[11px] text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-white hover:underline transition-all">Register for free</Link>
            </p>
          </div>
        </div>

        <div className="h-4" />
      </section>

    </div>
  )
}
