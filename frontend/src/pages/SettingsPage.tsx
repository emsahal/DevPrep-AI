import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { profileService } from '@/services/profileService'

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    icon: 'person',
    fields: [
      { label: 'Display Name',   type: 'text',  placeholder: 'Your name'        },
      { label: 'Email Address',  type: 'email', placeholder: 'you@example.com'  },
    ],
  },
  {
    title: 'Notifications',
    icon: 'notifications',
    toggles: [
      { label: 'Daily Revision Reminders', desc: 'Get reminded when you have topics due for revision.' },
      { label: 'Streak Alerts',            desc: 'Be notified before your streak is at risk of breaking.' },
      { label: 'New Content',              desc: 'Get notified when new topics or roadmaps are added.' },
    ],
  },
  {
    title: 'Appearance',
    icon: 'palette',
    toggles: [
      { label: 'Dark Mode', desc: 'Use the dark theme (recommended for night sessions).' },
    ],
  },
]

export function SettingsPage() {
  const { user: storeUser, logout } = useAuthStore()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  })

  const user = profile ?? storeUser

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Daily Revision Reminders': true,
    'Streak Alerts': true,
    'New Content': false,
    'Dark Mode': true,
  })

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {SETTINGS_SECTIONS.map(sec => (
          <div key={sec.title} className="bento-card p-6 animate-fade-up animation-delay-100">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>{sec.icon}</span>
              <h2 className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{sec.title}</h2>
            </div>

            {sec.fields && (
              <div className="space-y-4">
                {sec.fields.map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-outline)' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                           defaultValue={f.label === 'Display Name' ? user?.name ?? '' : f.label === 'Email Address' ? user?.email ?? '' : ''}
                           className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all ai-glow-focus"
                           style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)', color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }} />
                  </div>
                ))}
                <button className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 mt-2"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Save Changes
                </button>
              </div>
            )}

            {sec.toggles && (
              <div className="space-y-4">
                {sec.toggles.map(t => (
                  <div key={t.label} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{t.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>{t.desc}</p>
                    </div>
                    <button
                      onClick={() => setToggles(prev => ({ ...prev, [t.label]: !prev[t.label] }))}
                      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
                      style={{ background: toggles[t.label] ? 'var(--color-primary)' : 'var(--color-surface-container-high)' }}
                    >
                      <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                            style={{ transform: toggles[t.label] ? 'translateX(20px)' : 'translateX(0)' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="bento-card p-6 animate-fade-up animation-delay-200" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
          <h2 className="font-bold mb-4" style={{ color: 'var(--color-error)' }}>Danger Zone</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>Sign Out</p>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Sign out of your account on this device.</p>
            </div>
            <button onClick={logout}
                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}