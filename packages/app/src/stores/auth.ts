import { defineStore } from 'pinia'

import type { User } from '@/types'

export const useAuth = defineStore('account', {
  state: () => ({
    accessToken: localStorage.getItem('token'),
    user: null as User | null,
  }),
  getters: {
    hasToken: (state) => !!state.accessToken,
  },
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
      localStorage.setItem('token', token)
    },
    clearAccessToken() {
      this.accessToken = null
      localStorage.removeItem('token')
    },
    logout() {
      this.clearAccessToken()
      this.user = null
    },
  },
})
