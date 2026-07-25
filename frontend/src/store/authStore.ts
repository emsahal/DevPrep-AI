import { create } from 'zustand'
import { authService } from '@/services/authService'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setIsAuthenticated: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  logout: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  initialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, isAuthenticated: false })
  },
  initialize: async () => {
    if (!localStorage.getItem('accessToken')) {
      set({ initialized: true })
      return
    }
    set({ isLoading: true })
    try {
      const user = await authService.getProfile()
      set({ user, isAuthenticated: true, isLoading: false, initialized: true })
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false, isLoading: false, initialized: true })
    }
  },
}))