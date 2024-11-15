'use client'
import { Button, DialogContent, DialogTitle, FormControl, FormLabel, Input, Link, Modal, ModalClose, ModalDialog, Snackbar, Stack } from '@mui/joy'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { DefaultResponse, User } from '@/app/models'

interface Props {
  readingFromLocalStorage: boolean
  setLoggedInUser: (user: User | null) => void
}

interface State {
  openLoginDialog: boolean
  openPasswordDialog: boolean
  openMessageDialog: boolean
  loggingIn: boolean
  error: string
}

export const Login = ({ readingFromLocalStorage, setLoggedInUser }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    openLoginDialog: false,
    openPasswordDialog: false,
    openMessageDialog: false,
    loggingIn: false,
    error: ''
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleLogin = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const username: string = formJson.username as string
    const password: string = formJson.password as string
    setState(s => ({
      ...s,
      loggingIn: true,
      openLoginDialog: false
    }))
    const error: string = await requestLogin(username, password)
    setState(s => ({
      ...s,
      loggingIn: false,
      error
    }))
  }
  const requestLogin = async (username: string, password: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        signal
      })
      if (!response.ok) {
        return 'Login failed'
      }
      const json: DefaultResponse = await response.json()
      if (json.success) {
        setLoggedInUser(json.data as User)
        return ''
      } else {
        return json.message ?? ''
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      return `${error}`
    }
  }


  const handleOpenDialog = (): void => {
    setState(s => ({
      ...s,
      openLoginDialog: true
    }))
  }

  const handleCloseDialog = (): void => {
    setState(s => ({
      ...s,
      openLoginDialog: false,
      loggingIn: false,
      validationFailed: ''
    }))
    if (abortControllerRef.current != null) {
      abortControllerRef.current.abort()
    }
  }

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
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const email: string = formJson.email as string
    setState(s => ({
      ...s,
      openPasswordDialog: false
    }))
    const error: string = await requestResetToken(email)
    setState(s => ({
      ...s,
      openMessageDialog: error === '',
      openLoginDialog: error === '',
      error
    }))
  }

  const requestResetToken = async (email: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/generate-reset-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        signal
      })
      if (!response.ok) {
        return 'Reset password failed'
      }
      const json: DefaultResponse = await response.json()
      return json.message ?? ''
    } catch (error: unknown) {
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
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <>
      <Button
        disabled={state.loggingIn || readingFromLocalStorage}
        variant='solid'
        color='neutral'
        onClick={handleOpenDialog}
      >
        Login
      </Button>
      <Modal
        open={state.openLoginDialog}
        onClose={handleCloseDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            Please enter your username and password.
          </DialogContent>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input autoFocus name='username' type='text' required/>
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input name='password' type='password' required/>
              </FormControl>
              <Link onClick={handleForgotPassword} fontSize={12}>
                Forgot Password?
              </Link>
              <Button type='submit'>Login</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
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
      <Snackbar
        open={state.error !== ''}
        autoHideDuration={6000}
        onClose={() => setState(s => ({ ...s, error: '' }))}
      >
        {state.error}
      </Snackbar>
    </>
  )
}
