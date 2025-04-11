import { alovaInstance } from './instance'

import type { AuthLoginForm, AuthLoginPayload, FriendRequest, User } from '@/types'

// #region Auth API
export const login = ({ username, password }: AuthLoginForm) => {
  return alovaInstance.Post<AuthLoginPayload>('/auth/login', { username, password })
}

export const profile = () => {
  return alovaInstance.Get<User>('/auth/profile', {
    cacheFor: null,
  })
}

// #region Friend Request API
export const sendRequest = (receiverId: number, description: string | null) => {
  return alovaInstance.Post<FriendRequest>('/friend/request/send', { receiverId, description })
}

export const getReceived = () => {
  return alovaInstance.Get<FriendRequest[]>('/friend/request/received')
}

// #region User API
export const find = (searchKeyword: string) => {
  return alovaInstance.Get<User[]>('/user/find', { params: { searchKeyword } })
}
