import { usePageContext } from '@/app/context'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse } from '@/app/models'
import { useEffect, useRef, useState } from 'react'

export interface UseProfileMenu {
  loggingOut: boolean
  handleLogout: () => Promise<void>
}

export const useProfileMenu = (): UseProfileMenu => {
  const { setLoggedInUser, setError } = usePageContext()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [loggingOut, setLoggingOut] = useState<boolean>(false)
  
  const handleLogout = async (): Promise<void> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      setLoggingOut(true)
      const response = await fetch(`${getApiUrl()}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        signal
      })
      const json: DefaultResponse = await response.json()
      if (json.success) {
        setLoggedInUser(null)
      }
      setError(json.message ?? '')
      setLoggingOut(false)
    } catch (error: unknown) {
      setLoggingOut(false)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        console.error('Error:', error)
        setError('An error occurred')
      }
    }
  }
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return { loggingOut, handleLogout }
}
