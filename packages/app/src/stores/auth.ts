import * as apis from '@/apis'
import { acceptHMRUpdate, defineStore } from 'pinia'

import type { User } from '@/types'

export const useAuth = defineStore('account', {
  state: () => ({
    accessToken: localStorage.getItem('token'),
    user: null as User | null,
    userShadow: null as User | null,
  }),
  getters: {
    hasToken: (state) => !!state.accessToken,
  },
  actions: {
    async getUserProfile() {
      try {
        const user = await apis.getProfile()

        this.user = user
        this.userShadow = structuredClone(user)
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
