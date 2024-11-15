'use client'
import { useState, FormEvent, useCallback, useEffect, useRef } from 'react'
import { Container, Box, Input, Button, Typography, Stack, FormControl, FormLabel, FormHelperText, CircularProgress } from '@mui/joy'
import { FloatingBubbles } from '../../components'
import { PasswordStrength } from '@/app/components/auth/PasswordStength'
import { useParams } from 'next/navigation'
import { DefaultResponse, User } from '@/app/models'
import { ErrorCheck } from '@/app/models/ErrorCheck'

export default function ResetPasswordPage (): JSX.Element {
  const { resetToken } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string>('')
  const [outcome, setOutcome] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
  const [passwordScore, setPasswordScore] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const getUserForResetToken = async (): Promise<ErrorCheck<User>> => {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/get-user-for-reset-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ resetToken }),
          signal
        })
        if (!response.ok) {
          return ['Register failed', null]
        }
        const json: DefaultResponse = await response.json()
        if (json.success) {
          return [null, json.data as User]
        } else {
          return [json.message ?? '', null]
        }
      } catch (error: unknown) {
        console.error('Error:', error)
        return [`${error}`, null]
      }
    }

    getUserForResetToken()
      .then(([error, User]: ErrorCheck<User>) => {
        setLoading(false)
        if (error != null) {
          setError(error)
          return
        }
        setUser(User)
      })

  }, [resetToken])

  const handleChangePassword = (evt: FormEvent<HTMLInputElement>): void => {
    setPassword((evt.target as HTMLInputElement).value ?? '')
    setPasswordError('')
  }

  const validateForm = useCallback((confirmPassword: string): boolean => {
    let formValid: boolean = true
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
  }, [passwordScore, password])

  const handleResetPassword = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const confirmPassword: string = formJson.confirmPassword as string
    const formValid = validateForm(confirmPassword)
    if (!formValid) {
      return
    }
    setOutcome('')
    setError('')
    setLoading(true)
    const resetPasswordError: string = await requestResetPassword()
    setPassword('')
    setLoading(false)
    if (resetPasswordError === '') {
      setOutcome('Password reset successfully.')
    } else {
      setError(resetPasswordError)
    }
  }

  const requestResetPassword = async (): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id, newPassword: password, resetToken }),
        signal
      })
      if (!response.ok) {
        return 'Reset password failed.'
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

  return (
    <FloatingBubbles>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Box
          component='form'
          onSubmit={handleResetPassword}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: '400px',
            padding: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography level='h4' component='h1' gutterBottom>
            Reset Password
          </Typography>
          {loading && (<CircularProgress />)}
          {!loading && error && <Typography component='p'>{error}</Typography>}
          {!loading && error && user && <Typography component='p'>Please try again.</Typography>}
          {!loading && outcome && <Typography component='p'>{outcome}</Typography>}
          {!loading && user && !outcome && (
            <Stack spacing={2}>
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
              <Button type="submit">Reset Password</Button>
            </Stack>
          )}
        </Box>
      </Container>
    </FloatingBubbles>
  )
}