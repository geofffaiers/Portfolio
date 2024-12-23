import { usePageContext } from "@/app/context"
import { getApiUrl } from "@/app/helpers"
import { DefaultResponse, User } from "@/app/models"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"

export interface UseLogin {
  openLoginDialog: boolean
  loggingIn: boolean
  handleLogin: (evt: FormEvent<HTMLFormElement>) => Promise<void>
  handleOpenDialog: () => void
  handleCloseDialog: () => void
}

export const useLogin = (): UseLogin => {
  const { setError, setLoggedInUser } = usePageContext()
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false)
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const requestLogin = useCallback(async (username: string, password: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${getApiUrl()}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        signal
      })
      const json: DefaultResponse<User> = await response.json()
      if (json.success) {
        setLoggedInUser(json.data)
        return ''
      } else {
        return json.message ?? ''
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      return `${error}`
    }
  }, [setLoggedInUser])

  const handleLogin = useCallback(async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    evt.stopPropagation()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const username: string = formJson.username as string
    const password: string = formJson.password as string
    setLoggingIn(true)
    setOpenLoginDialog(false)
    const error: string = await requestLogin(username, password)
    setError(error)
    setLoggingIn(false)
  }, [setError, requestLogin])


  const handleOpenDialog = (): void => {
    setOpenLoginDialog(true)
  }

  const handleCloseDialog = (): void => {
    setOpenLoginDialog(false)
    setLoggingIn(false)
    if (abortControllerRef.current != null) {
      abortControllerRef.current.abort()
    }
  }
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort('Login: Component unmounted')
      }
    }
  }, [])

  return {
    openLoginDialog,
    loggingIn,
    handleLogin,
    handleOpenDialog,
    handleCloseDialog
  }
}
