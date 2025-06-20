import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { RouteLocationAsRelativeGeneric } from 'vue-router'
import type { UseEventBusReturn } from '@vueuse/core'

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

export interface Message {
  id: number
  authorId: number
  content: string
  createdAt: string
  updatedAt: string

  author: User
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

export interface DMMessage extends Message {
  sessionId: number

  session: DMSession
}

export interface FriendRequest {
  id: number
  senderId: number
  receiverId: number
  desciription?: string
  accepted: boolean
  denied: boolean
  canceled: boolean
  resolved: boolean
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

export interface ServerMember {
  id: number
  serverId: number
  userId: number
  createdAt: string

  server: Server
  user: User
}

export interface Server {
  id: number
  creatorId: number
  name: string
  avatarUrl: string | null
  avatarClass?: string
  createdAt: string
  updatedAt: string

  creator: User
  channels: Channel[]
}

export interface Channel {
  id: number
  rootChannelId?: number
  position: number
  serverId: number
  groupId: number
  creatorId: number
  lastMessageId: number
  name: string
  description: string
  iconClass: string
  isCategory: boolean
  createdAt: Date
  updatedAt: Date

  server: Server
  creator: User
}

export interface ChannelMessage extends Message {
  channelId: number

  channel: Channel
}

export type ChannelTree = Channel & { children: Channel[] }

export interface User {
  id: number
  displayName: string
  username: string
  email?: string
  introduction?: string
  avatarUrl: string | null
  bannerImageUrl: string | null
  bannerColor: string
  disabled: boolean
  isOnline: boolean
  createdAt: string
  updatedAt: string

  joinedServers: ServerMember[]
  roles?: number[]
}

export interface RouterMenuItem {
  label: string
  icon?: string
  to: RouteLocationAsRelativeGeneric
  badge?: MaybeRef<number | boolean>
}

export interface DMSessionIdMessagesMap {
  [dmSessionId: number]: DMMessage[]
}

export interface ChannelIdMessagesMap {
  [channelId: number]: ChannelMessage[]
}

export interface AppGlobalEventBusMap {
  onFriendRequestSent: UseEventBusReturn<FriendRequest, any>
  onFriendRequestAccepted: UseEventBusReturn<AcceptFriendRequestDto, any>
  onFriendRequestDenied: UseEventBusReturn<AcceptFriendRequestDto, any>
  onFriendRequestCanceled: UseEventBusReturn<AcceptFriendRequestDto, any>
}

export interface AppGlobalContext {
  isDev: boolean
  receivedFriendRequests: Ref<FriendRequest[]>
  sentFriendRequests: Ref<FriendRequest[]>
  friends: Ref<User[]>
  joinedServers: Ref<Server[]>
  dmSessions: Ref<DMSession[]>
  dmMessages: Ref<DMSessionIdMessagesMap>
  channelMessages: Ref<ChannelIdMessagesMap>
  mainTitleText: Ref<string>
  user: User
  events: AppGlobalEventBusMap

  unacceptFriendRequestCount?: ComputedRef<number>

  devLog: (...data: any[]) => void
}

export interface OpenDMSessionDto {
  userBId: number
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

export enum UserState {
  Online,
  Busy,
  Invisible,
  Custom,
}
