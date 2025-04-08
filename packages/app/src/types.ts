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
  username: string
  roles: number[]
  disabled: boolean
}
