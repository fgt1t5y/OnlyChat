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

export interface User {
  id: number
  displayName: string
  username: string
  avatarUrl: string
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
}
