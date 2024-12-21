'use client'
import { usePageContext } from '@/app/context'
import { getApiUrl } from '@/app/helpers'
import { faClose, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, Modal, ModalClose, ModalDialog, Snackbar, Stack, Textarea, Typography } from '@mui/joy'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

interface State {
  message: string
  type: 'danger' | 'success' | 'warning' | 'neutral'
}

export const CallToAction = (): JSX.Element => {
  const { loggedInUser, setPlay } = usePageContext()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [nameError, setNameError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [messageError, setMessageError] = useState<string>('')
  const [state, setState] = useState<State>({
    message: '',
    type: 'neutral'
  })
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
      setState({
        message: json.message || 'Email sent successfully',
        type: json.success ? 'success' : 'danger'
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setState({
          message: err.message,
          type: 'danger'
        })
      } else {
        setState({
          message: 'An error occurred',
          type: 'danger'
        })
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

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem', gap: '1rem' }}>
        <Typography level='h4' component='h4' style={{ fontWeight: 500, textAlign: 'center' }} gutterBottom>
          I am available for hire, let&#39;s work together!
        </Typography>
        <Box style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant='solid'
            color='neutral'
            size='lg'
            onClick={() => setPlay(true)}
            sx={{ whiteSpace: 'pre' }}
          >
            Play The Game (Ctrl + \)
          </Button>
          <Button
            component='a'
            variant='solid'
            color='primary'
            size='lg'
            href='/Geoffrey_Faiers.pdf'
            download
            sx={{ whiteSpace: 'pre', display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Download CV
          </Button>
          {!isLoggedIn && (
            <Button
              variant='solid'
              color='primary'
              size='lg'
              onClick={() => setOpenDialog(true)}
              sx={{ whiteSpace: 'pre' }}
            >
              Contact Me
            </Button>
          )}
        </Box>
      </Box>
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Contact Me</DialogTitle>
          <DialogContent>
            Please enter your email and a message, I will aim to get back to you as soon as possible.
          </DialogContent>
          {}
          <form onSubmit={handleSubmitForm}>
            <Stack spacing={2}>
              <FormControl error={nameError !== ''}>
                <FormLabel>Full Name</FormLabel>
                <Input autoFocus name='name' type='text' required/>
                <FormHelperText>{nameError}</FormHelperText>
              </FormControl>
              <FormControl error={emailError !== ''}>
                <FormLabel>Email</FormLabel>
                <Input name='email' type='text' required/>
                <FormHelperText>{emailError}</FormHelperText>
              </FormControl>
              <FormControl error={messageError !== ''}>
                <FormLabel>Message</FormLabel>
                <Textarea sx={{ maxHeight: '200px' }} name='message' minRows={5} required/>
                <FormHelperText>{messageError}</FormHelperText>
              </FormControl>
              <Button endDecorator={<FontAwesomeIcon icon={faPaperPlane}/>} type='submit' sx={{ whiteSpace: 'pre' }}>Send</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={state.message !== ''}
        autoHideDuration={6000}
        onClose={() => setState(s => ({ ...s, message: '' }))}
        variant='soft'
        color={state.type}
        size='md'
        endDecorator={
          <IconButton
            variant='soft'
            color={state.type}
            onClick={() => setState(s => ({ ...s, message: '' }))}
          >
            <FontAwesomeIcon icon={faClose}/>
          </IconButton>
        }
      >
        {state.message}
      </Snackbar>
    </>
  )
}
