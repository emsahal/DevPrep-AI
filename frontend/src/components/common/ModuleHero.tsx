import type { ReactNode } from 'react'

interface ModuleHeroProps {
  icon: string
  title: string
  description: string
  badge?: string
  accentColor?: string
  children?: ReactNode
}

export function ModuleHero({ icon, title, description, badge, accentColor = 'var(--color-primary)', children }: ModuleHeroProps) {
  return (
    <div className="bento-card ai-glow-border p-8 animate-fade-up relative overflow-hidden">
      {/* Decorative SVG shapes */}
      <svg className="absolute -top-6 -right-6 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 120 120" fill="none">
        <circle cx="100" cy="20" r="70" stroke={accentColor} strokeWidth="1" strokeDasharray="6 5" fill="none" />
        <circle cx="100" cy="20" r="40" stroke={accentColor} strokeWidth="0.5" opacity="0.6" fill="none" />
      </svg>
      <svg className="absolute -bottom-4 -left-4 w-20 h-20 opacity-10 pointer-events-none" viewBox="0 0 80 80" fill="none">
        <path d="M40 6L48 26L68 28L52 42L58 62L40 50L22 62L28 42L12 28L32 26L40 6Z" fill={accentColor} />
      </svg>

      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: `${accentColor}18` }}>
          <span className="material-symbols-outlined text-3xl" style={{ color: accentColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
              {title}
            </h1>
            {badge && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--color-on-surface-variant)' }}>
            {description}
          </p>

          {children && (
            <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}