
import React, { createContext, useState, ReactNode } from 'react'
import { User } from '../models'

interface PageContextType {
  loggedInUser: User | null
  setLoggedInUser: (user: User | null) => void
  play: boolean
  setPlay: (play: boolean) => void
  openRegisterDialog: boolean
  setOpenRegisterDialog: (open: boolean) => void
}

const PageContext = createContext<PageContextType | null>(null)

interface PageProviderProps {
  children: ReactNode
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [play, setPlay] = useState<boolean>(false)
  const [openRegisterDialog, setOpenRegisterDialog] = useState<boolean>(false)
  
  return (
    <PageContext.Provider value={{ loggedInUser, setLoggedInUser, play, setPlay, openRegisterDialog, setOpenRegisterDialog }}>
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
