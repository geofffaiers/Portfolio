export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL ?? '/api'
  }
  return '/api'
}

export const getWsUrl = (): string => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_WS_URL ?? '/api/ws'
  }
  return '/api/ws'
}
