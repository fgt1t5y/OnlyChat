import { alovaInstance } from './instance'

import type { AuthLoginForm, AuthLoginPayload } from '@/types'

export const login = ({ username, password }: AuthLoginForm) => {
  return alovaInstance.Post<AuthLoginPayload>('/auth/login', { username, password })
}
