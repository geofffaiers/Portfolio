import { usePageContext } from '@/app/context'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse, User } from '@/app/models'
import { FormEvent, useCallback, useEffect, useState } from 'react'

interface Props {
  validatePassword: (password: string, confirmPassword: string) => boolean
  onClose: () => void
}

interface HookResponse {
  setCurrentPassword: (currentPassword: string) => void
  password: string
  setPassword: (password: string) => void
  setConfirmPassword: (confirmPassword: string) => void
  tempUser: User | null
  handleChangePassword: (evt: FormEvent<HTMLFormElement>) => Promise<void>
}


export const useChangePassword = ({ validatePassword, onClose }: Props): HookResponse => {
  const { loggedInUser, setError } = usePageContext()
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [tempUser, setTempUser] = useState<User | null>(loggedInUser)

  useEffect(() => {
    if (password.length > 0) {
      validatePassword(password, password)
    }
  }, [validatePassword, password, confirmPassword])

  useEffect(() => {
    setTempUser(loggedInUser)
  }, [loggedInUser])

  const handleChangePassword = useCallback(async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    if (tempUser == null) return
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const password: string = formJson.password as string
    const confirmPassword: string = formJson.confirmPassword as string
    if (!validatePassword(password, confirmPassword)) return
    tempUser.password = password
    try {
      const response = await fetch(`${getApiUrl()}/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ ...tempUser, currentPassword })
      })
      const json: DefaultResponse<User> = await response.json()
      if (json.success) {
        onClose()
      } else {
        setError(`Failed to change password: ${json.message}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to change password: ${error.message}`)
      }
    }
  }, [tempUser, currentPassword, validatePassword, onClose, setError])

  return {
    setCurrentPassword,
    password,
    setPassword,
    setConfirmPassword,
    tempUser,
    handleChangePassword
  }
}