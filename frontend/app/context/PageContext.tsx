
import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { User } from '../models'
import { IconButton, Snackbar } from '@mui/joy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

interface PageContextType {
  loggedInUser: User | null
  setLoggedInUser: (user: User | null) => void
  play: boolean
  setPlay: (play: boolean) => void
  openRegisterDialog: boolean
  setOpenRegisterDialog: (open: boolean) => void
  isMobileDisplay: boolean
  error: string
  setError: (error: string) => void
}

const PageContext = createContext<PageContextType | null>(null)

interface PageProviderProps {
  children: ReactNode
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [play, setPlay] = useState<boolean>(false)
  const [openRegisterDialog, setOpenRegisterDialog] = useState<boolean>(false)
  const [isMobileDisplay, setIsMobileDisplay] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDisplay(window.innerWidth < 600)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <PageContext.Provider value={{ loggedInUser, setLoggedInUser, play, setPlay, openRegisterDialog, setOpenRegisterDialog, isMobileDisplay, error, setError }}>
      {children}
      <Snackbar
        open={error !== ''}
        autoHideDuration={null}
        onClose={() => setError('')}
        variant='soft'
        color='danger'
        size='md'
        endDecorator={
          <IconButton
            variant='soft'
            color='danger'
            onClick={() => setError('')}
          >
            <FontAwesomeIcon icon={faClose}/>
          </IconButton>
        }
      >
        {error}
      </Snackbar>
    </PageContext.Provider>
  )
}

export const usePageContext = (): PageContextType => {
  const context = React.useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}
