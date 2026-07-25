import api from '@/lib/axios'
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types'

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', input)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', input)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/profile')
    return data
  },

  async updateProfile(input: Partial<User>): Promise<User> {
    const { data } = await api.put<User>('/auth/profile', input)
    return data
  },
}
