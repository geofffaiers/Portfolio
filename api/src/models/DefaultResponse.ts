export interface DefaultResponse<T = unknown> {
  success: boolean
  message?: string
  stack?: string
  data?: T
}
