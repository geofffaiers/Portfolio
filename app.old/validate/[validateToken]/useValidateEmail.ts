import { getApiUrl } from '@/app.old/helpers'
import { DefaultResponse, User } from '@/app.old/models'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseValidateEmail {
  error: string
}

interface Props {
  validateToken: string
}

export const useValidateEmail = ({ validateToken }: Props): UseValidateEmail => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const getUserForResetToken = useCallback(async (): Promise<void> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${getApiUrl()}/users/get-user-for-validate-token?validateToken=${validateToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal
      })
      if (!response.ok) {
        setError('Validate token failed')
        return
      }
      const json: DefaultResponse<User> = await response.json()
      if (json.success) {
        setUser(json.data)
      } else {
        setError(json.message ?? '')
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }, [validateToken])

  const validateEmail = useCallback(async (): Promise<void> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${getApiUrl()}/users/validate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id, validateToken }),
        signal
      })
      if (!response.ok) {
        setError('Validate token failed')
        return
      }
      const json: DefaultResponse = await response.json()
      if (json.success) {
        router.push('/')
      } else {
        setError(json.message ?? '')
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }, [user, router, validateToken])

  useEffect(() => {
    try {
      if (user == null) {
        getUserForResetToken()
      } else {
        validateEmail()
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }, [user, getUserForResetToken, validateEmail])

  return {
    error
  }
}
