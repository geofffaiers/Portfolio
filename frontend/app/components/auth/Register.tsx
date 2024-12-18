'use client'
import { Button, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { DefaultResponse, User } from '@/app/models'
import { getApiUrl } from '@/app/helpers'
import { usePageContext } from '@/app/context'
import { SetPassword } from '../SetPassword'

interface Props {
  readingFromLocalStorage: boolean
  setLoggedInUser: (user: User | null) => void
  setError: (error: string) => void
}

export const Register = ({ readingFromLocalStorage, setLoggedInUser, setError }: Props): JSX.Element => {
  const { openRegisterDialog, setOpenRegisterDialog } = usePageContext()
  const [waiting, setWaiting] = useState<boolean>(false)
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
    setOpenRegisterDialog(false)
    setWaiting(true)
    setPassword('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    const registerError: string = await requestRegister(email, username, password)
    if (registerError === '') {
      const loginError: string = await requestLogin(username, password)
      setError(loginError)
    } else {
      setError(registerError)
    }
    setWaiting(false)
  }

  const requestRegister = async (email: string, username: string, password: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${getApiUrl()}/users/create`, {
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
      return `${error}`
    }
  }

  const requestLogin = async (username: string, password: string): Promise<string> => {
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
      return `${error}`
    }
  }


  const handleOpenDialog = (): void => {
    setOpenRegisterDialog(true)
  }

  const handleCloseDialog = (): void => {
    setPassword('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setOpenRegisterDialog(false)
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
        loading={waiting || readingFromLocalStorage}
        variant='solid'
        color='neutral'
        onClick={handleOpenDialog}
      >
        Register
      </Button>
      <Modal
        open={openRegisterDialog}
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
                <Input autoFocus name='email' type='email' required onChange={() => setEmailError('')}/>
                <FormHelperText>{emailError}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input name='username' type='text' required/>
              </FormControl>
              <SetPassword
                password={password}
                passwordError={passwordError}
                confirmPasswordError={confirmPasswordError}
                handleChangePassword={handleChangePassword}
                setConfirmPasswordError={setConfirmPasswordError}
                setPasswordScore={setPasswordScore}
              />
              <Button type='submit'>Register & Login</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}
