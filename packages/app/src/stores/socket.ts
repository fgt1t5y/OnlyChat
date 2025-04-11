import { useAuth } from '@/stores/auth'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

import type { WsEventBodyMap } from '@/types'

export const useSocketIO = defineStore('socket', {
  state: () => ({
    connected: false,
    socket: io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket'],
      reconnectionAttempts: 8,
    }),
  }),
  actions: {
    connectAsync(): Promise<typeof this.socket> {
      return new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          resolve(this.socket)
        })
        this.socket.on('connect_error', (err) => {
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
    emit<E extends keyof WsEventBodyMap>(event: E, body: WsEventBodyMap[E]) {
      this.socket.emit(event, body)
    },
  },
})
