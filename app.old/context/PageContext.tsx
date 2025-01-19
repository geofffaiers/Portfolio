
import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { User } from '../models'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()
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

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error
      })
      setError('')
    }
  }, [error])

  return (
    <PageContext.Provider value={{ loggedInUser, setLoggedInUser, play, setPlay, openRegisterDialog, setOpenRegisterDialog, isMobileDisplay, error, setError }}>
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
