import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { profileService } from '@/services/profileService'
import { dashboardService } from '@/services/dashboardService'
import { gamificationService } from '@/services/gamificationService'
import { resumeOptimizerService } from '@/services/resumeOptimizerService'
import { BadgesGrid } from '@/features/gamification/components/BadgesGrid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ProfilePage() {
  const { user: storeUser } = useAuthStore()
  const [expandedResume, setExpandedResume] = useState<string | null>(null)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  })

  const { data: stats } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
  })

  const { data: gamificationStats } = useQuery({
    queryKey: ['gamification', 'stats'],
    queryFn: () => gamificationService.getStats(),
  })

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeOptimizerService.getUserResumes(),
  })

  const user = profile ?? storeUser

  const optimizedResumes = resumes.filter((r: any) => r.jobTitle || r.atsScore != null)

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="bento-card ai-glow-border p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-fade-up">
        <Avatar className="w-20 h-20 flex-shrink-0 ring-2 ring-offset-2">
          <AvatarImage src={user?.avatar ?? undefined} />
          <AvatarFallback className="text-3xl font-extrabold"
                         style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
            {user?.name?.charAt(0) ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }}>
            {user?.name ?? 'Developer'}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--color-outline)' }}>{user?.email ?? 'user@devprep.ai'}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="pill" style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(208,188,255,0.25)' }}>Full Stack Track</span>
            <span className="pill" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.25)' }}>{stats?.streakDays ?? 0}-Day Streak 🔥</span>
            {gamificationStats && (
              <span className="pill" style={{ background: 'rgba(208,188,255,0.15)', color: 'var(--color-tertiary)', border: '1px solid rgba(208,188,255,0.25)' }}>
                Lvl {gamificationStats.level} · {gamificationStats.title}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* XP Bar */}
      {gamificationStats && (
        <div className="bento-card p-5 mb-6 animate-fade-up animation-delay-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold" style={{ color: 'var(--color-on-surface)' }}>
              Level {gamificationStats.level} — {gamificationStats.title}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
              {gamificationStats.xp.toLocaleString()} / {gamificationStats.nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, ((gamificationStats.xp - gamificationStats.currentLevelXp) / (gamificationStats.nextLevelXp - gamificationStats.currentLevelXp)) * 100)}%`,
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-tertiary))',
              }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs" style={{ color: 'var(--color-outline)' }}>
            <span>🔥 {gamificationStats.currentStreak}-day streak</span>
            <span>🏆 {gamificationStats.totalPoints.toLocaleString()} total points</span>
          </div>
        </div>
      )}

      {/* Badges */}
      {gamificationStats && gamificationStats.badges.length > 0 && (
        <div className="mb-8 animate-fade-up animation-delay-75">
          <h2 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: 'var(--color-outline)' }}>
            Badges & Achievements
          </h2>
          <BadgesGrid earnedBadges={gamificationStats.badges} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up animation-delay-100">
        {[
          { label: 'Topics Mastered', value: String(stats?.completedTopics ?? 0),  icon: 'school'            },
          { label: 'Quizzes Taken',   value: String(stats?.quizAttempts ?? 0),     icon: 'quiz'              },
          { label: 'Level',           value: gamificationStats ? `Lvl ${gamificationStats.level}` : '—', icon: 'stars' },
          { label: 'Total Points',    value: gamificationStats ? gamificationStats.totalPoints.toLocaleString() : '0', icon: 'trophy' },
        ].map(s => (
          <div key={s.label} className="bento-card p-5 flex flex-col items-center gap-2 text-center">
            <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>{s.icon}</span>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--color-on-surface)' }}>{s.value}</span>
            <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Resume Optimizations */}
      <div className="animate-fade-up animation-delay-150 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
              Resume Optimizations
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              {optimizedResumes.length > 0
                ? `${optimizedResumes.length} resume${optimizedResumes.length > 1 ? 's' : ''} optimized for specific job roles`
                : 'No resumes optimized yet'}
            </p>
          </div>
          {optimizedResumes.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-lg font-semibold"
                  style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
              {optimizedResumes.reduce((max: number, r: any) => Math.max(max, r.atsScore ?? 0), 0)}% Best ATS
            </span>
          )}
        </div>

        {optimizedResumes.length === 0 ? (
          <div className="rounded-2xl p-8 text-center"
               style={{ background: 'var(--color-surface-container)', border: '1px dashed var(--color-border-muted)' }}>
            <span className="material-symbols-outlined text-3xl mb-3" style={{ color: 'var(--color-outline)' }}>description</span>
            <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Optimize your first resume to see results here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {optimizedResumes.map((resume: any) => {
              const jobAnalysis = resume.suggestions?._jobAnalysis || {}
              const companyName = jobAnalysis.companyName
              const isExpanded = expandedResume === resume.id

              return (
                <div key={resume.id}
                     className="rounded-2xl overflow-hidden transition-all duration-300"
                     style={{
                       background: 'var(--color-surface-container)',
                       border: '1px solid var(--color-border-subtle)',
                     }}>
                  <button
                    onClick={() => setExpandedResume(isExpanded ? null : resume.id)}
                    className="w-full flex items-center gap-4 p-4 text-left cursor-pointer border-none bg-transparent"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(208,188,255,0.1)' }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>description</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>
                        {resume.jobTitle || 'Untitled Role'}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {[companyName, new Date(resume.createdAt).toLocaleDateString()].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    {/* ATS Score */}
                    <div className="flex flex-col items-center flex-shrink-0 px-3">
                      <div className="text-base font-extrabold" style={{ color: (resume.atsScore ?? 0) >= 80 ? 'var(--color-success)' : (resume.atsScore ?? 0) >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                        {resume.atsScore ?? '—'}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>ATS</div>
                    </div>

                    {/* Interview Chance */}
                    <div className="flex flex-col items-center flex-shrink-0 px-3">
                      <div className="text-base font-extrabold" style={{ color: (resume.interviewChance ?? 0) >= 70 ? 'var(--color-success)' : (resume.interviewChance ?? 0) >= 40 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                        {resume.interviewChance != null ? `${resume.interviewChance}%` : '—'}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Interview</div>
                    </div>

                    {/* Expand icon */}
                    <span className="material-symbols-outlined text-xl flex-shrink-0 transition-transform duration-200"
                          style={{ color: 'var(--color-outline)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                  </button>

                  {/* Expanded content */}
                  <div className="overflow-hidden transition-all duration-300"
                       style={{ maxHeight: isExpanded ? '500px' : '0px' }}>
                    <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                      {/* Skills match */}
                      <div className="pt-4">
                        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                          Skills Match — {resume.matchScore ?? 0}%
                        </p>
                        {resume.missingSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {resume.missingSkills.map((s: string) => (
                              <span key={s} className="text-[11px] px-2 py-0.5 rounded-lg"
                                    style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--color-error)' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Job description preview */}
                      {resume.jobDescription && (
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                            Job Description
                          </p>
                          <p className="text-xs leading-relaxed line-clamp-4" style={{ color: 'var(--color-outline)' }}>
                            {resume.jobDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bento-card p-6 animate-fade-up animation-delay-200">
        <h2 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: 'var(--color-outline)' }}>Account Info</h2>
        <div className="space-y-3">
          {[
            { icon: 'person', label: 'Name', value: user?.name ?? '—' },
            { icon: 'email', label: 'Email', value: user?.email ?? '—' },
            { icon: 'calendar_today', label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
          ].map(a => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
              <span className="material-symbols-outlined text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }}>{a.icon}</span>
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                <span className="font-semibold">{a.label}:</span> {a.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}