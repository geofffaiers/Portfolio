'use client'
import { Button, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Input, Modal, ModalClose, ModalDialog, Snackbar, Stack } from '@mui/joy'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { DefaultResponse, User } from '@/app/models'
import { PasswordStrength } from './PasswordStrength'

interface Props {
  readingFromLocalStorage: boolean
  setLoggedInUser: (user: User | null) => void
}

interface State {
  openDialog: boolean
  waiting: boolean
  error: string
}

export const Register = ({ readingFromLocalStorage, setLoggedInUser }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    openDialog: false,
    waiting: false,
    error: ''
  })
  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordScore, setPasswordScore] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const validateForm = useCallback((email: string, password: string, confirmPassword: string): boolean => {
    let formValid: boolean = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email is invalid')
      formValid = false
    } else {
      setEmailError('')
    }
    if (passwordScore <= 3) {
      setPasswordError('Password is too weak')
      formValid = false
    } else {
      setPasswordError('')
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      formValid = false
    } else {
      setConfirmPasswordError('')
    }
    return formValid
  }, [passwordScore])

  const handleRegister = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const email: string = formJson.email as string
    const username: string = formJson.username as string
    const password: string = formJson.password as string
    const confirmPassword: string = formJson.confirmPassword as string
    const formValid = validateForm(email, password, confirmPassword)
    if (!formValid) {
      return
    }
    setState(s => ({
      ...s,
      waiting: true,
      openDialog: false
    }))
    const registerError: string = await requestRegister(email, username, password)
    if (registerError === '') {
      const loginError: string = await requestLogin(username, password)
      setState(s => ({
        ...s,
        waiting: false,
        error: loginError
      }))
    } else {
      setState(s => ({
        ...s,
        waiting: false,
        error: registerError
      }))
    }
  }

  const requestRegister = async (email: string, username: string, password: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password }),
        signal
      })
      if (!response.ok) {
        return 'Register failed'
      }
      const json: DefaultResponse = await response.json()
      if (json.success) {
        return ''
      } else {
        return json.message ?? ''
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      return `${error}`
    }
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
      openDialog: true
    }))
  }

  const handleCloseDialog = (): void => {
    setPassword('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setState(s => ({
      ...s,
      openDialog: false,
      loggingIn: false,
      validationFailed: ''
    }))
    if (abortControllerRef.current != null) {
      abortControllerRef.current.abort()
    }
  }

  const handleChangePassword = (evt: FormEvent<HTMLInputElement>): void => {
    setPassword((evt.target as HTMLInputElement).value ?? '')
    setPasswordError('')
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
        loading={state.waiting || readingFromLocalStorage}
        variant='solid'
        color='neutral'
        onClick={handleOpenDialog}
      >
        Register
      </Button>
      <Modal
        open={state.openDialog}
        onClose={handleCloseDialog}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            Please fill out the form below to register.
          </DialogContent>
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <FormControl error={emailError !== ''}>
                <FormLabel>Email</FormLabel>
                <Input autoFocus name="email" type="email" required onChange={() => setEmailError('')}/>
                <FormHelperText>{emailError}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input autoFocus name="username" type="text" required/>
              </FormControl>
              <FormControl error={passwordError !== ''}>
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" required onChange={handleChangePassword}/>
                <FormHelperText>{passwordError}</FormHelperText>
              </FormControl>
              <FormControl error={confirmPasswordError !== ''}>
                <FormLabel>Confirm Password</FormLabel>
                <Input name="confirmPassword" type="password" required onChange={() => setConfirmPasswordError('')}/>
                <FormHelperText>{confirmPasswordError}</FormHelperText>
              </FormControl>
              <PasswordStrength password={password} setPasswordScore={setPasswordScore}/>
              <Button type="submit">Register & Login</Button>
            </Stack>
          </form>
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
