import { useCallback, useState } from 'react'
import { User } from '../models'

interface HookResponse {
  setPasswordScore: (score: number) => void
  validate: (partialUser: Partial<User>) => boolean
  validatePassword: (password: string, confirmPassword: string) => boolean
  usernameError: string
  emailError: string
  passwordError: string
  confirmPasswordError: string
  firstNameError: string
  lastNameError: string
}

export const useUserValidations = (): HookResponse => {
  const [usernameError, setUsernameError] = useState<string>('')
  const [firstNameError, setFirstNameError] = useState<string>('')
  const [lastNameError, setLastNameError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
  const [passwordScore, setPasswordScore] = useState<number>(0)

  const validate = useCallback((partialUser: Partial<User>): boolean => {
    let formValid: boolean = true

    if (partialUser.email != null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partialUser.email)) {
      setEmailError('Email is invalid')
      formValid = false
    } else {
      setEmailError('')
    }

    if (partialUser.username != null && partialUser.username.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      formValid = false
    } else {
      setUsernameError('')
    }

    if (partialUser.firstName != null && partialUser.firstName.length < 3) {
      setFirstNameError('First name must be at least 3 characters')
      formValid = false
    } else {
      setFirstNameError('')
    }

    if (partialUser.lastName != null && partialUser.lastName.length < 3) {
      setLastNameError('Last name must be at least 3 characters')
      formValid = false
    } else {
      setLastNameError('')
    }

    return formValid
  }, [])

  const validatePassword = useCallback((password: string, confirmPassword: string): boolean => {
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
  }, [passwordScore])

  return {
    setPasswordScore,
    validate,
    validatePassword,
    usernameError,
    emailError,
    passwordError,
    confirmPasswordError,
    firstNameError,
    lastNameError,
  }
}
