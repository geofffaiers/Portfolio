import { usePageContext } from '@/app/context'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse, User } from '@/app/models'
import { useCallback, useEffect, useState } from 'react'

export const useProfile = () => {
  const { loggedInUser, setLoggedInUser } = usePageContext()
  const [tempUser, setTempUser] = useState<User | null>(loggedInUser)

  useEffect(() => {
    setTempUser(loggedInUser)
  }, [loggedInUser])

  const onChange = useCallback(<K extends keyof User>(property: K, value: User[K]) => {
    setTempUser(prevUser => prevUser ? { ...prevUser, [property]: value } : null)
  }, [])

  const onSubmit = useCallback(async () => {
    if (!tempUser) return
    try {
      const response = await fetch(`${getApiUrl()}/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(tempUser)
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const json: DefaultResponse<User> = await response.json()
      if (json.success && json.data != null) {
        setLoggedInUser(json.data)
      } else {
        console.error('Failed to update user:', json.message)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }, [tempUser, setLoggedInUser])

  return {
    tempUser,
    onChange,
    onSubmit
  }
}
