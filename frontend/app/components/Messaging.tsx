'use client'
import { User } from "../models"

interface Props {
  children: React.ReactNode
  loggedInUser: User | null
}

export const Messaging = ({ children, loggedInUser }: Props): JSX.Element => {
  return (
    <>
      <div style={{ position: 'fixed', width: '200px', height: '30px', backgroundColor: 'var(--foreground)', bottom: 0, right: 20, zIndex: 4 }}></div>
      {children}
    </>
  )
}
