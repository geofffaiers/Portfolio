'use client'
import { Button, DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { DefaultResponse, User } from '@/app/models'
import { ForgotPassword } from './ForgotPassword'

interface Props {
  readingFromLocalStorage: boolean
  setLoggedInUser: (user: User | null) => void
  setError: (error: string) => void
}

interface State {
  openLoginDialog: boolean
  openPasswordDialog: boolean
  openMessageDialog: boolean
  loggingIn: boolean
}

export const Login = ({ readingFromLocalStorage, setLoggedInUser, setError }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    openLoginDialog: false,
    openPasswordDialog: false,
    openMessageDialog: false,
    loggingIn: false
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleLogin = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    evt.stopPropagation()
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
    setError(error)
    setState(s => ({
      ...s,
      loggingIn: false
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
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort('Login: Component unmounted')
      }
    }
  }, [])

  return (
    <>
      <Button
        loading={state.loggingIn || readingFromLocalStorage}
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
              <ForgotPassword setError={setError}/>
              <Button type='submit'>Login</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}
