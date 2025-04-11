import { useAuth } from '@/stores/auth'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'

export const useSocketIO = defineStore('socket', {
  state: () => ({
    connected: false,
    socket: io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] }),
  }),
  actions: {
    connect() {
      this.socket.on('connect', () => {
        this.connected = true
      })
      this.socket.on('disconnect', () => {
        this.connected = false
      })

      this.socket.auth = { token: useAuth().accessToken }
      this.socket.connect()
    },
    connectAsync(): Promise<typeof this.socket> {
      return new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          this.connected = true
          resolve(this.socket)
        })
        this.socket.on('connect_error', (err) => {
          this.connected = false
          reject(err)
        })

        this.socket.auth = { token: useAuth().accessToken }
        this.socket.connect()
      })
    },
    disconnect() {
      this.socket.disconnect()

      this.connected = false
    },
  },
})
