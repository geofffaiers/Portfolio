'use client'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse } from '@/app/models'
import { Button, DialogContent, DialogTitle, FormControl, FormLabel, Input, Link, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { FormEvent, useEffect, useRef, useState } from 'react'

interface Props {
  setError: (error: string) => void
}

interface State {
  openPasswordDialog: boolean
  openMessageDialog: boolean
}

export const ForgotPassword = ({ setError }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    openPasswordDialog: false,
    openMessageDialog: false
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleForgotPassword = (): void => {
    setState(s => ({
      ...s,
      openPasswordDialog: true
    }))
  }

  const handleClosePasswordDialog = (): void => {
    setState(s => ({
      ...s,
      openPasswordDialog: false
    }))
  }

  const handleGenerateResetToken = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    evt.stopPropagation()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const email: string = formJson.email as string
    setState(s => ({
      ...s,
      openPasswordDialog: false
    }))
    const error: string = await requestResetToken(email)
    setError(error)
    setState(s => ({
      ...s,
      openMessageDialog: error === '',
      openLoginDialog: error === ''
    }))
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
    setState(s => ({
      ...s,
      openMessageDialog: false
    }))
  }
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort('ForgotPassword: Component unmounted')
      }
    }
  }, [])

  return (
    <>
      <Link onClick={handleForgotPassword} fontSize={12}>
        Forgot Password?
      </Link>
      <Modal
        open={state.openPasswordDialog}
        onClose={handleClosePasswordDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            Please enter your email address, we&apos;ll email you a link to reset your password.
          </DialogContent>
          <form onSubmit={handleGenerateResetToken}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input autoFocus name='email' type='email' required/>
              </FormControl>
              <Button type='submit'>Send email</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Modal
        open={state.openMessageDialog}
        onClose={handleCloseMessageDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            Please check your emails.
          </DialogContent>
          <Button onClick={handleCloseMessageDialog}>OK</Button>
        </ModalDialog>
      </Modal>
    </>
  )
}
