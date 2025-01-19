import { usePageContext } from "@/app/context"
import { getApiUrl } from "@/app/helpers"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"

export interface UseCallToAction {
  openDialog: boolean
  nameError: string
  emailError: string
  messageError: string
  displaySuccess: boolean
  isLoggedIn: boolean
  setOpenDialog: (open: boolean) => void
  setDisplaySuccess: (display: boolean) => void
  handleSubmitForm: (evt: FormEvent<HTMLFormElement>) => Promise<void>
}

export const useCallToAction = (): UseCallToAction => {
  const { loggedInUser, setError } = usePageContext()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [nameError, setNameError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [messageError, setMessageError] = useState<string>('')
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isLoggedIn: boolean = !!loggedInUser

  const validateForm = useCallback((name: string, email: string, message: string): boolean => {
    let formValid: boolean = true
    if (name.length < 3) {
      setNameError('Name is invalid')
      formValid = false
    } else if (name.indexOf(' ') === -1) {
      setNameError('Please enter your full name')
      formValid = false
    } else {
      setNameError('')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email is invalid')
      formValid = false
    } else {
      setEmailError('')
    }
    if (message.length < 10) {
      setMessageError('Message is too short')
      formValid = false
    } else {
      setMessageError('')
    }
    return formValid
  }, [])

  const handleSubmitForm = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault()
    const formData: FormData = new FormData(evt.currentTarget)
    const formJson: { [k: string]: FormDataEntryValue } = Object.fromEntries(formData.entries())
    const name: string = (formJson.name as string).trim()
    const email: string = (formJson.email as string).trim()
    const message: string = (formJson.message as string).trim()
    const formValid = validateForm(name, email, message)
    if (!formValid) {
      return
    }
    setOpenDialog(false)
    try {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      const response = await fetch(`${getApiUrl()}/messaging/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message }),
        signal
      })
      const json = await response.json()
      if (json.success) {
        setDisplaySuccess(true)
      } else {
        setError(json.message)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An error occurred')
      }
    }
  }

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    openDialog,
    nameError,
    emailError,
    messageError,
    displaySuccess,
    isLoggedIn,
    setOpenDialog,
    setDisplaySuccess,
    handleSubmitForm
  }
}
