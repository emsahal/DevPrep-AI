import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDuelSocket } from '@/services/socketService'
import { duelService } from '@/services/duelService'
import { useDuelStore } from '@/store/duelStore'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/providers/ToastProvider'

const MODES = [
  { id: 'quiz', label: 'Quiz Battle', icon: 'quiz', desc: 'AI-generated quiz on any topic' },
  { id: 'flashcard', label: 'Flashcard Sprint', icon: 'style', desc: 'Race through flashcards' },
  { id: 'coding', label: 'Coding Battle', icon: 'code', desc: 'Solve coding challenges' },
]

const TOPICS = [
  'any', 'javascript', 'python', 'react', 'nodejs', 'algorithms', 'data-structures',
  'system-design', 'sql', 'typescript',
]

interface OnlineUser {
  userId: string
  name: string
  avatar: string | null
  mode: string | null
  topic: string | null
}

export function DuelPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState<'mode' | 'topic' | 'searching' | 'incoming'>('mode')
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('any')
  const [available, setAvailable] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const { incomingRequest, setIncomingRequest, setActiveDuel, setSearching: storeSearching } = useDuelStore()

  const socket = getDuelSocket()

  useEffect(() => {
    socket.on('duel:online_users', (users: OnlineUser[]) => {
      setOnlineUsers(users)
    })
    socket.on('duel:searching', () => setStep('searching'))
    socket.on('duel:request_received', (data) => {
      setIncomingRequest(data)
      setStep('incoming')
    })
    socket.on('duel:match_found', (data) => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
      setActiveDuel(data)
      navigate(`/duel/battle/${data.duelId}`)
    })
    socket.on('duel:request_declined', (data) => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
      if (data.reason === 'expired') {
        toast({ type: 'info', title: 'No opponent found', message: 'Nobody was available. Try again.' })
      }
      setStep('mode')
      setIncomingRequest(null)
    })
    socket.on('duel:challenge_sent', () => {
      toast({ type: 'success', title: 'Challenge sent!', message: 'Waiting for them to accept...' })
    })
    socket.on('duel:error', (data) => {
      toast({ type: 'error', title: 'Error', message: data.message })
      setStep('mode')
    })

    return () => {
      socket.off('duel:online_users')
      socket.off('duel:searching')
      socket.off('duel:request_received')
      socket.off('duel:match_found')
      socket.off('duel:request_declined')
      socket.off('duel:challenge_sent')
      socket.off('duel:error')
    }
  }, [socket, navigate, setIncomingRequest, setActiveDuel, toast])

  const pollForOpponent = () => {
    searchTimer.current = setTimeout(() => {
      socket.emit('duel:request_match', { mode: selectedMode, topic: selectedTopic })
      pollForOpponent()
    }, 5000)
  }

  const startSearch = () => {
    storeSearching(selectedMode, selectedTopic)
    socket.emit('duel:set_available', { mode: selectedMode, topic: selectedTopic })
    socket.emit('duel:request_match', { mode: selectedMode, topic: selectedTopic })
    setStep('searching')
    pollForOpponent()
  }

  const cancelSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    socket.emit('duel:set_unavailable', { mode: selectedMode, topic: selectedTopic })
    setStep('mode')
  }

  const acceptRequest = async () => {
    if (incomingRequest) {
      try {
        // REST primary — persists accept to DB and triggers match creation
        await duelService.acceptRequest(incomingRequest.matchRequestId)
        // Socket event as secondary for real-time opponent notification
        socket.emit('duel:accept', { matchRequestId: incomingRequest.matchRequestId })
      } catch {
        toast({ type: 'error', title: 'Failed to accept', message: 'Please try again.' })
      }
    }
  }

  const declineRequest = async () => {
    if (incomingRequest) {
      try {
        await duelService.declineRequest(incomingRequest.matchRequestId)
        socket.emit('duel:decline', { matchRequestId: incomingRequest.matchRequestId })
      } catch {
        // Silently clear UI even on error
      }
      setIncomingRequest(null)
      setStep('mode')
    }
  }

  const challengeUser = async (user: OnlineUser) => {
    if (!selectedMode) {
      toast({ type: 'warning', title: 'Select a mode first' })
      return
    }
    try {
      // REST primary — works even if socket is disconnected, persists to DB, sends notification
      await duelService.requestMatch(user.userId, selectedMode, selectedTopic)
      // Socket secondary — for immediate real-time feedback on both sides
      socket.emit('duel:challenge', { toUserId: user.userId, mode: selectedMode, topic: selectedTopic })
      toast({ type: 'success', title: 'Challenge sent!', message: `Waiting for ${user.name} to accept...` })
    } catch {
      toast({ type: 'error', title: 'Challenge failed', message: 'Could not reach the server. Try again.' })
    }
  }

  const toggleAvailable = () => {
    if (available) {
      socket.emit('duel:set_unavailable', { mode: selectedMode, topic: selectedTopic })
    } else if (selectedMode) {
      socket.emit('duel:set_available', { mode: selectedMode, topic: selectedTopic })
    } else {
      toast({ type: 'warning', title: 'Select a mode first' })
      return
    }
    setAvailable(!available)
  }

  const currentUser = useAuthStore(s => s.user)

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>
          Study Duel
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Challenge other learners in real-time battles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main duel panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode selection */}
          {step === 'mode' && (
            <div className="space-y-4">
              <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
                Select Mode
              </h2>
              <div className="grid gap-3">
                {MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMode(m.id); setStep('topic') }}
                    className="bento-card p-5 flex items-center gap-4 text-left transition-all hover:scale-[1.01]"
                    style={{ borderColor: selectedMode === m.id ? 'var(--color-primary)' : undefined }}
                  >
                    <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--color-primary)' }}>{m.icon}</span>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{m.label}</p>
                      <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Available toggle */}
              <div className="bento-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>Available for Duels</p>
                  <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Others can challenge you directly</p>
                </div>
                <button
                  onClick={toggleAvailable}
                  className={`w-12 h-7 rounded-full transition-colors ${available ? 'bg-primary' : 'bg-surface-container-low'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${available ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          )}

          {/* Topic selection */}
          {step === 'topic' && (
            <div className="space-y-4">
              <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
                Select Topic
              </h2>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: selectedTopic === t ? 'var(--color-primary)' : 'var(--color-surface-container-low)',
                      color: selectedTopic === t ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                    }}
                  >
                    {t === 'any' ? 'Any Topic' : t.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep('mode')} className="px-6 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
                  Back
                </button>
                <button onClick={startSearch} className="flex-1 px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Find Opponent
                </button>
              </div>
            </div>
          )}

          {/* Searching */}
          {step === 'searching' && (
            <div className="bento-card p-12 text-center">
              <span className="material-symbols-outlined animate-spin text-5xl mb-4" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
              <p className="font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>Searching for opponent...</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Looking for someone who wants to play {selectedMode} on {selectedTopic === 'any' ? 'any topic' : selectedTopic}
              </p>
              <button onClick={cancelSearch}
                      className="mt-6 px-6 py-2 rounded-xl text-sm font-medium"
                      style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
                Cancel
              </button>
            </div>
          )}

          {/* Incoming request */}
          {step === 'incoming' && incomingRequest && (
            <div className="bento-card p-8 text-center ring-1" style={{ borderColor: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined text-5xl mb-3" style={{ color: 'var(--color-primary)' }}>sports_esports</span>
              <p className="font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>
                {incomingRequest.fromUser.name} wants to duel!
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                {incomingRequest.mode} · {incomingRequest.topic}
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button onClick={declineRequest}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
                  Decline
                </button>
                <button onClick={acceptRequest}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                  Accept
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Online users sidebar */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-outline)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online ({onlineUsers.length})
          </h2>
          {onlineUsers.length === 0 ? (
            <div className="bento-card p-6 text-center">
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>No one else is online right now</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              {onlineUsers.map(u => (
                <div key={u.userId} className="bento-card p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                         style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>{u.name}</p>
                      {u.mode && (
                        <p className="text-[10px] truncate" style={{ color: 'var(--color-on-surface-variant)' }}>
                          {u.mode}{u.topic ? ` · ${u.topic}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  {u.userId !== currentUser?.id && (
                    <button
                      onClick={() => challengeUser(u)}
                      className="px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0 transition-opacity hover:opacity-90"
                      style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}
                    >
                      Challenge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
