import { alovaInstance } from './instance'

import type {
  AuthLoginForm,
  AuthLoginPayload,
  DMMessage,
  DMSession,
  Friend,
  ChannelMessage,
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

export const updateProfiles = (patchedUser: Partial<User>) => {
  return alovaInstance.Post<Partial<User>>('/auth/profile', patchedUser)
}

export const uploadAvatar = (blob: Blob) => {
  const formData = new FormData()

  formData.append('avatar', blob)

  return alovaInstance.Post<Partial<User>>('/auth/avatar', formData)
}

// #region DM Session API
export const getDMSessions = () => {
  return alovaInstance.Get<DMSession[]>('/dm-sessions')
}

export const openDMSession = (userBId: number) => {
  return alovaInstance.Post<DMSession>('/dm-sessions', { userBId })
}

export const closeDMSession = (userBId: number) => {
  return alovaInstance.Delete<void>('/dm-sessions', { userBId })
}

// #region DM Message API
export const getDMMessagesBefore = (dmSessionId: number, before: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>(`/dm/${dmSessionId}/messages`, {
    params: { before, takeCount },
  })
}

export const getDMMessagesAround = (dmSessionId: number, around: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>(`/dm/${dmSessionId}/messages`, {
    params: { around, takeCount },
  })
}

export const getDMMessagesAfter = (dmSessionId: number, after: number, takeCount: number) => {
  return alovaInstance.Get<DMMessage[]>(`/dm/${dmSessionId}/messages`, {
    params: { after, takeCount },
  })
}

export const sendDMMessage = (dmSessionId: number, content: string) => {
  return alovaInstance.Post<DMMessage>(`/dm/${dmSessionId}/messages`, { content })
}

// #region Friend Request API
export const sendFriendRequest = (receiverId: number) => {
  return alovaInstance.Post<FriendRequest>('/friend-requests/send', { receiverId })
}

export const acceptFriendRequest = (friendRequestId: number) => {
  return alovaInstance.Post<void>('/friend-requests/accept', { friendRequestId })
}

export const cancelFriendRequest = (friendRequestId: number) => {
  return alovaInstance.Post<void>('/friend-requests/cancel', { friendRequestId })
}

export const denyFriendRequest = (friendRequestId: number) => {
  return alovaInstance.Post<void>('/friend-requests/deny', { friendRequestId })
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
  return alovaInstance.Get<ServerMember[]>(`/server/${serverId}/members`)
}

// #region User API
export const getUser = (username: string) => {
  return alovaInstance.Get<User>('/user', { params: { username } })
}

// #region Channel Message API
export const getChannelMessagesBefore = (channelId: number, before: number, takeCount: number) => {
  return alovaInstance.Get<ChannelMessage[]>(`/channel/${channelId}/messages`, {
    params: { before, takeCount },
  })
}

export const getChannelMessagesAround = (channelId: number, around: number, takeCount: number) => {
  return alovaInstance.Get<ChannelMessage[]>(`/channel/${channelId}/messages`, {
    params: { around, takeCount },
  })
}

export const getChannelMessagesAfter = (channelId: number, after: number, takeCount: number) => {
  return alovaInstance.Get<ChannelMessage[]>(`/channel/${channelId}/messages`, {
    params: { after, takeCount },
  })
}

export const sendChannelMessage = (channelId: number, content: string) => {
  return alovaInstance.Post<ChannelMessage>(`/channel/${channelId}/messages`, { content })
}
