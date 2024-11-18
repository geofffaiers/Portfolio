import {  Box, IconButton, Snackbar, styled } from '@mui/joy'
import { User } from '../../models'
import { Login } from './Login'
import { Logout } from './Logout'
import { Register } from './Register'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

interface State {
  loggedInUser: User | null
  readingFromLocalStorage: boolean
  error: string
}

interface Props {
  children: React.ReactNode
  setLoggedInUser: (user: User | null) => void
}

const StyledBox = styled(Box)`
  position: fixed;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center';
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3;
`

export const Auth = ({ children, setLoggedInUser }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    loggedInUser: null,
    readingFromLocalStorage: true,
    error: ''
  })
  const abortControllerRef = useRef<AbortController | null>(null)
  const { loggedInUser, readingFromLocalStorage } = state

  const handleSetLoggedInUser = useCallback((user: User | null) => {
    setLoggedInUser(user)
    setState({
      readingFromLocalStorage: false,
      loggedInUser: user,
      error: ''
    })
  }, [setLoggedInUser])

  const refreshToken = async (): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      signal
    })
    if (!response.ok) {
      return 'Refresh token failed'
    }
    const data = await response.json()
    if (data.success) {
      return ''
    }
    return data.message ?? 'Refresh token failed'
  }

  const handleSetError = useCallback((error: string) => {
    setState(s => ({ ...s, error }))
  }, [setState])

  useEffect(() => {
    const loadFromStorage = async () => {
      const savedUser = localStorage.getItem('loggedInUser')
      if (savedUser) {
        const refreshError: string = await refreshToken()
        if (refreshError === '') {
          handleSetLoggedInUser(JSON.parse(savedUser))
        } else {
          setState({
            loggedInUser: null,
            readingFromLocalStorage: false,
            error: refreshError
          })
        }
      } else {
        setState({
          loggedInUser: null,
          readingFromLocalStorage: false,
          error: ''
        })
      }
    }

    if (readingFromLocalStorage) {
      loadFromStorage()
    }
  }, [readingFromLocalStorage, handleSetLoggedInUser])

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    } else {
      localStorage.removeItem('loggedInUser')
    }
  }, [loggedInUser])

  return (
    <>
      {loggedInUser == null && <StyledBox>
        <Register readingFromLocalStorage={readingFromLocalStorage} setLoggedInUser={handleSetLoggedInUser} setError={handleSetError}/>
        <Login readingFromLocalStorage={readingFromLocalStorage} setLoggedInUser={handleSetLoggedInUser} setError={handleSetError}/>
      </StyledBox>}
      {loggedInUser != null && <StyledBox>
        <Logout setLoggedInUser={handleSetLoggedInUser} setError={handleSetError}/>
      </StyledBox>}
      {children}
      <Snackbar
        open={state.error !== ''}
        autoHideDuration={6000}
        onClose={() => handleSetError('')}
        variant='soft'
        color='danger'
        size='md'
        endDecorator={
          <IconButton
            variant='soft'
            color='danger'
            onClick={() => handleSetError('')}
          >
            <FontAwesomeIcon icon={faClose}/>
          </IconButton>
        }
      >
        {state.error}
      </Snackbar>
    </>
  )
}
