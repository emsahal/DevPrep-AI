import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDuelSocket } from '@/services/socketService'
import { useDuelStore } from '@/store/duelStore'

const MODES = [
  { id: 'quiz', label: 'Quiz Battle', icon: 'quiz', desc: 'AI-generated quiz on any topic' },
  { id: 'flashcard', label: 'Flashcard Sprint', icon: 'style', desc: 'Race through flashcards' },
]

const TOPICS = [
  'any', 'javascript', 'python', 'react', 'nodejs', 'algorithms', 'data-structures',
  'system-design', 'sql', 'typescript',
]

export function DuelPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'mode' | 'topic' | 'searching' | 'incoming'>('mode')
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('any')
  const [available, setAvailable] = useState(false)
  const { incomingRequest, setIncomingRequest, setActiveDuel, setSearching: storeSearching } = useDuelStore()

  const socket = getDuelSocket()

  useEffect(() => {
    socket.on('duel:searching', () => setStep('searching'))
    socket.on('duel:request_received', (data) => {
      setIncomingRequest(data)
      setStep('incoming')
    })
    socket.on('duel:match_found', (data) => {
      setActiveDuel(data)
      navigate(`/duel/battle/${data.duelId}`)
    })
    socket.on('duel:request_declined', () => {
      setStep('mode')
      setIncomingRequest(null)
    })
    socket.on('duel:error', (data) => {
      alert(data.message)
      setStep('mode')
    })

    return () => {
      socket.off('duel:searching')
      socket.off('duel:request_received')
      socket.off('duel:match_found')
      socket.off('duel:request_declined')
      socket.off('duel:error')
    }
  }, [socket, navigate, setIncomingRequest, setActiveDuel])

  const startSearch = () => {
    storeSearching(selectedMode, selectedTopic)
    socket.emit('duel:set_available', { mode: selectedMode, topic: selectedTopic })
    socket.emit('duel:request_match', { mode: selectedMode, topic: selectedTopic })
    setStep('searching')
  }

  const acceptRequest = () => {
    if (incomingRequest) {
      socket.emit('duel:accept', { matchRequestId: incomingRequest.matchRequestId })
    }
  }

  const declineRequest = () => {
    if (incomingRequest) {
      socket.emit('duel:decline', { matchRequestId: incomingRequest.matchRequestId })
      setIncomingRequest(null)
      setStep('mode')
    }
  }

  const toggleAvailable = () => {
    if (available && selectedMode) {
      socket.emit('duel:set_unavailable', { mode: selectedMode, topic: selectedTopic })
    }
    setAvailable(!available)
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>
          Study Duel
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Challenge other learners in real-time battles
        </p>
      </div>

      {/* Mode selection */}
      {step === 'mode' && (
        <div className="space-y-4 animate-fade-up">
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
        <div className="space-y-4 animate-fade-up">
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
        <div className="bento-card p-12 text-center animate-fade-up">
          <span className="material-symbols-outlined animate-spin text-5xl mb-4" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
          <p className="font-bold text-lg" style={{ color: 'var(--color-on-surface)' }}>Searching for opponent...</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            Looking for someone who wants to play {selectedMode} on {selectedTopic === 'any' ? 'any topic' : selectedTopic}
          </p>
          <button onClick={() => { socket.emit('duel:set_unavailable', {}); setStep('mode') }}
                  className="mt-6 px-6 py-2 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)' }}>
            Cancel
          </button>
        </div>
      )}

      {/* Incoming request */}
      {step === 'incoming' && incomingRequest && (
        <div className="bento-card p-8 text-center animate-fade-up ring-1" style={{ borderColor: 'var(--color-primary)' }}>
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
  )
}
