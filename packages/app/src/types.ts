export interface IResponse<T> {
  success: boolean
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
