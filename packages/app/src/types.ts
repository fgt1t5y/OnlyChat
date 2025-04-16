import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { RouteLocationAsRelativeGeneric } from 'vue-router'

export interface IResponse<T> {
  success?: boolean
  statusCode: number
  message?: string
  data: T
}

export interface AuthLoginForm {
  username: string
  password: string
}

export interface AuthLoginPayload {
  token: string
}

export interface DMSession {
  id: number
  userAId: number
  userBId: number
  isOpen: boolean
  createdAt: string
  updatedAt: string
  lastMessageId: number

  userA: User
  userB: User
}

export interface DMMessage {
  id: number
  authorId: number
  sessionId: number
  content: string
  createdAt: string
  updatedAt: string

  author: User
  session: User
}

export interface FriendRequest {
  id: number
  senderId: number
  receiverId: number
  desciription?: string
  accepted: boolean
  createdAt: string
  updatedAt: string

  sender: User
  receiver: User
}

export interface Friend {
  id: number
  userAId: number
  userBId: number
  noteName?: string
  createdAt: string
  updatedAt: string

  userA: User
  userB: User
}

export interface User {
  id: number
  displayName: string
  username: string
  email?: string
  introduction?: string
  avatarUrl?: string
  avatarVersion: number
  disabled: boolean
  isOnline: boolean
  createdAt: string
  updatedAt: string
  roles?: number[]
}

export interface RouterMenuItem {
  label: string
  icon: string
  to: RouteLocationAsRelativeGeneric
  badge?: MaybeRef<number | boolean>
}

export interface DmSessionIdMessagesMap {
  [dmSessionId: number]: DMMessage[]
}

export interface AppGlobalContext {
  isDev: boolean
  receivedFriendRequests: Ref<FriendRequest[]>
  sentFriendRequests: Ref<FriendRequest[]>
  friends: Ref<User[]>
  dmSessions: Ref<DMSession[]>
  dmMessages: Ref<DmSessionIdMessagesMap>

  unacceptFriendRequestCount?: ComputedRef<number>
}

export interface OpenDMSessionDto {
  userBId: number;
}

export interface SendDMMessageDto {
  dmSessionId: number
  content: string
}

export interface SendFriendRequestDto {
  receiverId: number
}

export interface AcceptFriendRequestDto {
  friendRequestId: number
}

export interface CancelFriendRequestDto {
  friendRequestId: number
}

export interface WsEventBodyMap {
  'dm_message.send': SendDMMessageDto
  'friend_request.send': SendFriendRequestDto
  'friend_request.accept': AcceptFriendRequestDto
  'friend_request.cancel': CancelFriendRequestDto
}
