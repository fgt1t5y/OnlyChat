import { alovaInstance } from './instance'

import type { AuthLoginForm, AuthLoginPayload, User } from '@/types'

export const login = ({ username, password }: AuthLoginForm) => {
  return alovaInstance.Post<AuthLoginPayload>('/auth/login', { username, password })
}

export const me = () => {
  return alovaInstance.Get<User>('/auth/me', {
    cacheFor: null
  })
}
