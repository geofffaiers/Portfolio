'use client'
import { Login } from './Login'
import { ProfileMenu } from './ProfileMenu'
import { Register } from './Register'
import { usePageContext } from '@/app.old/context'
import { UseAuth, useAuth } from './hooks/useAuth'

interface Props {
  children: React.ReactNode
}

export default function Auth({ children }: Props): JSX.Element {
  const { loggedInUser } = usePageContext()
  const { readingFromLocalStorage }: UseAuth = useAuth()

  return (
    <>
      <div className="fixed top-5 right-5 z-30 hidden gap-4 flex-wrap items-center md:flex">
        {loggedInUser && (<ProfileMenu/>)}
        {!loggedInUser && (
          <>
            <Register readingFromLocalStorage={readingFromLocalStorage}/>
            <Login readingFromLocalStorage={readingFromLocalStorage}/>
          </>
        )}
      </div>
      {children}
    </>
  )
}
