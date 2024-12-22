import { usePageContext } from '@/app/context'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse } from '@/app/models'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

export interface UseForgotPassword {
  openPasswordDialog: boolean
  openMessageDialog: boolean
  handleForgotPassword: () => void
  handleClosePasswordDialog: () => void
  handleGenerateResetToken: (evt: FormEvent<HTMLFormElement>) => void
  handleCloseMessageDialog: () => void
}

export const useForgotPassword = (): UseForgotPassword => {
  const { setError } = usePageContext()
  const [openPasswordDialog, setOpenPasswordDialog] = useState<boolean>(false)
  const [openMessageDialog, setOpenMessageDialog] = useState<boolean>(false)
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleForgotPassword = useCallback((): void => {
    setOpenPasswordDialog(true)
  }, [])

  const handleClosePasswordDialog = useCallback((): void => {
    setOpenPasswordDialog(false)
  }, [])

  const handleGenerateResetToken = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    evt.stopPropagation()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const email: string = formJson.email as string
    setOpenPasswordDialog(false)
    const error: string = await requestResetToken(email)
    setError(error)
    const open: boolean = error === ''
    setOpenMessageDialog(open)
    setOpenPasswordDialog(open)
  }

  const requestResetToken = async (email: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${getApiUrl()}/users/generate-reset-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        signal
      })
      const json: DefaultResponse = await response.json()
      return json.message ?? ''
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error.message
      }
      console.error('Error:', error)
      return `${error}`
    }
  }
  const handleCloseMessageDialog = (): void => {
    setOpenMessageDialog(false)
  }
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort('ForgotPassword: Component unmounted')
      }
    }
  }, [])

  return { openPasswordDialog, openMessageDialog, handleForgotPassword, handleClosePasswordDialog, handleGenerateResetToken, handleCloseMessageDialog }
}
