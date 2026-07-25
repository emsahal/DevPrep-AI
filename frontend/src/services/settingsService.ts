import api from '@/lib/axios'

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export const settingsService = {
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/auth/change-password', data)
  },

  async updateProfile(data: { name?: string; learningPrefs?: Record<string, unknown> }) {
    const { data: res } = await api.put('/auth/profile', data)
    return res
  },
}
