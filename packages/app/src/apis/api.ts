import { alovaInstance } from './instance'

import type {
  AuthLoginForm,
  AuthLoginPayload,
  DMMessage,
  DMSession,
  FriendRequest,
  User,
} from '@/types'

// #region Auth API
export const login = ({ username, password }: AuthLoginForm) => {
  return alovaInstance.Post<AuthLoginPayload>('/auth/login', { username, password })
}

export const getProfile = () => {
  return alovaInstance.Get<User>('/auth/profile', {
    cacheFor: null,
  })
}

// #region DM Session API
export const getDmSessions = () => {
  return alovaInstance.Get<DMSession[]>('/dm/session')
}

export const openDMSession = (userBId: number) => {
  return alovaInstance.Post<DMSession>('/dm/session', { userBId })
}

export const closeDMSession = (userBId: number) => {
  return alovaInstance.Delete<void>('/dm/session', { userBId })
}

// #region DM Message API
export const getDmMessages = (dmSessionId: number, after: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>('/dm/message', {
    params: { dmSessionId, after, takeCount },
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
  return alovaInstance.Get<User[]>('/friend')
}

// #region User API
export const findUser = (searchKeyword: string) => {
  return alovaInstance.Get<User[]>('/user/find', { params: { searchKeyword } })
}
