import { usePageContext } from '@/app/context'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse, User } from '@/app/models'
import { FormEvent, useCallback, useEffect, useState } from 'react'

interface Props {
  validate: (partialUser: Partial<User>) => boolean
}

interface HookResponse {
  tempUser: User | null
  handleChangeValue: <K extends keyof User>(property: K, value: User[K]) => void
  handleSaveChanges: (evt?: FormEvent<HTMLFormElement> | undefined) => Promise<void>
  showDeleteAccount: boolean
  setShowDeleteAccount: (show: boolean) => void
  handleDeleteAccount: (evt: FormEvent<HTMLFormElement>) => Promise<void>
  error: string
  setError: (error: string) => void
  userChanged: boolean
  emailMatched: boolean | null
}

export const useProfile = ({ validate }: Props): HookResponse => {
  const { loggedInUser, setLoggedInUser } = usePageContext()
  const [tempUser, setTempUser] = useState<User | null>(loggedInUser)
  const [showDeleteAccount, setShowDeleteAccount] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [userChanged, setUserChanged] = useState<boolean>(false)
  const [emailMatched, setEmailMatched] = useState<boolean | null>(null)

  useEffect(() => {
    setTempUser(loggedInUser)
    setUserChanged(false)
  }, [loggedInUser])

  const handleChangeValue = useCallback(<K extends keyof User>(property: K, value: User[K]) => {
    if (typeof value === 'string') {
      value = value.trimStart() as User[K]
    }
    if (property === 'firstName' || property === 'lastName') {
      value = (value as string).charAt(0).toUpperCase() + (value as string).slice(1) as User[K]
    }
    validate({ ...tempUser, [property]: value })
    setTempUser(prevUser => prevUser ? { ...prevUser, [property]: value } : null)
    setUserChanged(true)
  }, [tempUser, validate])

  const handleSaveChanges = useCallback(async (evt?: FormEvent<HTMLFormElement> | undefined): Promise<void> => {
    evt?.preventDefault()
    if (!tempUser) return
    if (!validate(tempUser)) return
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
        setError('Network response was not ok')
        return
      }
      const json: DefaultResponse<User> = await response.json()
      if (json.success && json.data != null) {
        setLoggedInUser(json.data)
      } else {
        setError(`Failed to update user: ${json.message}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to update user: ${error.message}`)
      }
    }
  }, [tempUser, setLoggedInUser, validate])

  const handleSetShowDeleteAccount = useCallback((show: boolean): void => {
    setEmailMatched(null)
    setShowDeleteAccount(show)
  }, [])

  const handleDeleteAccount = useCallback(async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt?.preventDefault()
    if (!loggedInUser) return
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const email: string = formJson.email as string
    if (email !== loggedInUser.email) {
      setEmailMatched(false)
      return
    } else {
      setEmailMatched(true)
    }
    try {
      const response = await fetch(`${getApiUrl()}/users/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        setError('Network response was not ok')
        return
      }
      const json: DefaultResponse<User> = await response.json()
      if (json.success) {
        setLoggedInUser(null)
      } else {
        setError(`Failed to delete user: ${json.message}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to delete user: ${error.message}`)
      }
    }
  }, [loggedInUser, setLoggedInUser])

  return {
    tempUser,
    handleChangeValue,
    handleSaveChanges,
    showDeleteAccount,
    setShowDeleteAccount: handleSetShowDeleteAccount,
    handleDeleteAccount,
    error,
    setError,
    userChanged,
    emailMatched,
  }
}
