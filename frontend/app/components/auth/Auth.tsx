import {  Box, styled } from '@mui/joy'
import { User } from '../../models'
import { Login } from './Login'
import { Logout } from './Logout'
import { Register } from './Register'
import { useEffect, useRef, useState } from 'react'

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

  const handleSetLoggedInUser = (user: User | null) => {
    setLoggedInUser(user)
    setState({
      readingFromLocalStorage: false,
      loggedInUser: user,
      error: ''
    })
  }

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

  useEffect(() => {
    const loadFromStorage = async () => {
      const savedUser = localStorage.getItem('loggedInUser')
      if (savedUser) {
        const refreshError: string = await refreshToken()
        if (refreshError !== '') {
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
  }, [readingFromLocalStorage])

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
        <Register readingFromLocalStorage={readingFromLocalStorage} setLoggedInUser={handleSetLoggedInUser}/>
        <Login readingFromLocalStorage={readingFromLocalStorage} setLoggedInUser={handleSetLoggedInUser} />
      </StyledBox>}
      {loggedInUser != null && <StyledBox>
        <Logout setLoggedInUser={handleSetLoggedInUser} />
      </StyledBox>}
      {children}
    </>
  )
}
