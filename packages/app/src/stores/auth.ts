import { defineStore } from 'pinia'

import type { User } from '@/types'
import apis from '@/apis'
import { useRouter } from 'vue-router'

export const useAuth = defineStore('account', {
  state: () => ({
    accessToken: localStorage.getItem('token'),
    user: null as User | null,
  }),
  getters: {
    hasToken: (state) => !!state.accessToken,
  },
  actions: {
    async getUserProfile() {
      try {
        this.user = await apis.auth.getProfile()
      } catch {
        this.logout()
      }
    },
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
