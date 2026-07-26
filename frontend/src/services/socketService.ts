import { io, Socket } from 'socket.io-client'
import { apiBaseUrl } from '@/lib/axios'

let socket: Socket | null = null

export function getDuelSocket(): Socket {
  if (!socket) {
    const baseUrl = apiBaseUrl.replace('/api', '')
    const token = localStorage.getItem('accessToken')
    socket = io(`${baseUrl}/duels`, {
      auth: { token },
      // WebSocket first — persistent connection, avoids Render's HTTP timeout that drops long-polling
      // Polling is kept as a fallback only
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 15000,
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
