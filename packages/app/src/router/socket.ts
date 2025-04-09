import { useAuth } from '@/stores/auth'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useSocketIO = defineStore('socket', {
  state: () => ({
    connected: false,
    socket: io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] }),
  }),
  actions: {
    connect() {
      const auth = useAuth()

      this.socket.on('connect', () => {
        this.connected = true
      })

      this.socket.on('disconnect', () => {
        this.connected = false
      })

      this.socket.auth = { token: auth.accessToken }
      this.socket.connect()
    },
    disconnect() {
      this.socket.disconnect()

      this.connected = false
    },
  },
})
