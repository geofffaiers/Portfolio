export interface DefaultResponse<T = undefined> {
  success: boolean
  code: number
  message?: string
  stack?: string
  data?: T
}
