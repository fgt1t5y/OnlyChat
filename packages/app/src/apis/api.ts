import { alovaInstance } from './instance'

import type { AuthLoginForm, AuthLoginPayload, Friend, FriendRequest, User } from '@/types'

// #region Auth API
export const login = ({ username, password }: AuthLoginForm) => {
  return alovaInstance.Post<AuthLoginPayload>('/auth/login', { username, password })
}

export const getProfile = () => {
  return alovaInstance.Get<User>('/auth/profile', {
    cacheFor: null,
  })
}

// #region Friend Request API
export const sendFriendRequest = (receiverId: number) => {
  return alovaInstance.Post<FriendRequest>('/friend/request/send', { receiverId })
}

export const getReceivedFriendRequest = () => {
  return alovaInstance.Get<FriendRequest[]>('/friend/request/received')
}

export const getSentFriendRequest = () => {
  return alovaInstance.Get<FriendRequest[]>('/friend/request/sent')
}

// #region Friend API
export const getFriends = () => {
  return alovaInstance.Get<Friend[]>('/friend')
}

// #region User API
export const findUser = (searchKeyword: string) => {
  return alovaInstance.Get<User[]>('/user/find', { params: { searchKeyword } })
}
