import { io, Socket } from 'socket.io-client'
import { apiBaseUrl } from '@/lib/axios'

let socket: Socket | null = null

export function getDuelSocket(): Socket {
  if (!socket) {
    const baseUrl = apiBaseUrl.replace('/api', '')
    const token = localStorage.getItem('accessToken')
    socket = io(`${baseUrl}/duels`, {
      auth: { token },
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    })
  }
  return socket
}

export function disconnectDuelSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
