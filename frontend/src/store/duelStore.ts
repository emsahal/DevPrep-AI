import { create } from 'zustand'

export interface MatchRequestReceived {
  matchRequestId: string
  fromUser: { id: string; name: string; avatar: string | null }
  mode: string
  topic: string
  expiresAt: string
}

export interface DuelStarting {
  duelId: string
  mode: string
  topic: string
  content: { type: string; questions: unknown[]; timeLimit: number }
  timeLimit: number
  startedAt: string
}

export interface DuelResult {
  duelId: string
  winnerId: string | null
  score1: number
  score2: number
  breakdown: { player1: { accuracy: number; speed: number; total: number }; player2: { accuracy: number; speed: number; total: number } }
  xpEarned: number
}

interface DuelState {
  searching: boolean
  mode: string | null
  topic: string | null
  incomingRequest: MatchRequestReceived | null
  activeDuel: DuelStarting | null
  duelResult: DuelResult | null
  opponentProgress: { questionsAnswered: number; totalQuestions: number } | null

  setSearching: (mode: string, topic: string) => void
  clearSearching: () => void
  setIncomingRequest: (req: MatchRequestReceived | null) => void
  setActiveDuel: (duel: DuelStarting | null) => void
  setDuelResult: (result: DuelResult | null) => void
  setOpponentProgress: (progress: { questionsAnswered: number; totalQuestions: number } | null) => void
  reset: () => void
}

export const useDuelStore = create<DuelState>((set) => ({
  searching: false,
  mode: null,
  topic: null,
  incomingRequest: null,
  activeDuel: null,
  duelResult: null,
  opponentProgress: null,

  setSearching: (mode, topic) => set({ searching: true, mode, topic }),
  clearSearching: () => set({ searching: false, mode: null, topic: null }),
  setIncomingRequest: (req) => set({ incomingRequest: req, searching: false }),
  setActiveDuel: (duel) => set({ activeDuel: duel, incomingRequest: null, searching: false, duelResult: null }),
  setDuelResult: (result) => set({ duelResult: result, activeDuel: null }),
  setOpponentProgress: (progress) => set({ opponentProgress: progress }),
  reset: () => set({ searching: false, mode: null, topic: null, incomingRequest: null, activeDuel: null, duelResult: null, opponentProgress: null }),
}))
