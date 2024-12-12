
import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { User } from '../models'

interface PageContextType {
  loggedInUser: User | null
  setLoggedInUser: (user: User | null) => void
  play: boolean
  setPlay: (play: boolean) => void
  openRegisterDialog: boolean
  setOpenRegisterDialog: (open: boolean) => void
  isMobileDisplay: boolean
}

const PageContext = createContext<PageContextType | null>(null)

interface PageProviderProps {
  children: ReactNode
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [play, setPlay] = useState<boolean>(false)
  const [openRegisterDialog, setOpenRegisterDialog] = useState<boolean>(false)
  const [isMobileDisplay, setIsMobileDisplay] = useState<boolean>(window.innerWidth < 600)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDisplay(window.innerWidth < 600)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <PageContext.Provider value={{ loggedInUser, setLoggedInUser, play, setPlay, openRegisterDialog, setOpenRegisterDialog, isMobileDisplay }}>
      {children}
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
