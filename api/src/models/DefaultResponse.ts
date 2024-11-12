export interface DefaultResponse<T = unknown> {
  success: boolean
  code?: number
  message?: string
  stack?: string
  data?: T
}
