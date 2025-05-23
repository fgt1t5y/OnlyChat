import { alovaInstance } from './instance'

import type {
  AuthLoginForm,
  AuthLoginPayload,
  DMMessage,
  DMSession,
  Friend,
  FriendRequest,
  ServerMember,
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

export const updateProfile = (patchedUser: Partial<User>) => {
  return alovaInstance.Post<Partial<User>>('/auth/profile', patchedUser)
}

export const uploadAvatar = (blob: Blob) => {
  const formData = new FormData()

  formData.append('avatar', blob)

  return alovaInstance.Post<Partial<User>>('/auth/avatar', formData)
}

// #region DM Session API
export const getDmSessions = () => {
  return alovaInstance.Get<DMSession[]>('/dm-sessions')
}

export const openDMSession = (userBId: number) => {
  return alovaInstance.Post<DMSession>('/dm-sessions', { userBId })
}

export const closeDMSession = (userBId: number) => {
  return alovaInstance.Delete<void>('/dm-sessions', { userBId })
}

// #region DM Message API
export const getDmMessagesBefore = (dmSessionId: number, before: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>('/dm-messages', {
    params: { dmSessionId, before, takeCount },
  })
}

export const getDmMessagesAround = (dmSessionId: number, around: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>('/dm-messages', {
    params: { dmSessionId, around, takeCount },
  })
}

export const getDmMessagesAfter = (dmSessionId: number, after: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>('/dm-messages', {
    params: { dmSessionId, after, takeCount },
  })
}

// #region Friend Request API
export const sendFriendRequest = (receiverId: number) => {
  return alovaInstance.Post<FriendRequest>('/friend-requests/send', { receiverId })
}

export const getFriendRequests = () => {
  return alovaInstance.Get<FriendRequest[]>('/friend-requests')
}

// #region Friend API
export const getFriends = () => {
  return alovaInstance.Get<Friend[]>('/friends')
}

// #region Server Member API
export const getServerMembers = (serverId: number) => {
  return alovaInstance.Get<ServerMember[]>(`server/${serverId}/members`)
}

// #region User API
export const findUser = (searchKeyword: string) => {
  return alovaInstance.Get<User[]>('/user/find', { params: { searchKeyword } })
}
