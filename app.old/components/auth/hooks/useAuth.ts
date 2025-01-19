import { usePageContext } from '@/app.old/context'
import { getApiUrl } from '@/app.old/helpers'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseAuth {
  readingFromLocalStorage: boolean
}

export const useAuth = (): UseAuth => {
  const { loggedInUser, setLoggedInUser, setError } = usePageContext()
  const [readingFromLocalStorage, setReadingFromLocalStorage] = useState<boolean>(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const refreshToken = useCallback(async (): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    const response = await fetch(`${getApiUrl()}/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      signal
    })
    const data = await response.json()
    if (data.success) {
      return ''
    }
    return data.message ?? 'Refresh token failed'
  }, [])

  useEffect(() => {
    const loadFromStorage = async () => {
      const savedUser = localStorage.getItem('loggedInUser')
      if (savedUser) {
        const refreshError: string = await refreshToken()
        if (refreshError === '') {
          setLoggedInUser(JSON.parse(savedUser))
        } else {
          setLoggedInUser(null)
          setError(refreshError)
        }
      } else {
        setLoggedInUser(null)
        setError('')
      }
      setReadingFromLocalStorage(false)
    }

    if (readingFromLocalStorage) {
      loadFromStorage()
    }
  }, [readingFromLocalStorage, setLoggedInUser, setError, refreshToken])

  useEffect(() => {
    if (loggedInUser) {
      setReadingFromLocalStorage(false)
      setError('')
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    } else {
      localStorage.removeItem('loggedInUser')
    }
  }, [setError, loggedInUser])

  return { readingFromLocalStorage }
}
