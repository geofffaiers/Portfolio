'use client'
import { useState, lazy, Suspense, useMemo } from 'react'
import { Cv, FloatingBubbles, CookieConsent } from './components'
import { User } from './models'

const Auth = lazy(() => import('./components/auth/Auth'))
const Messaging = lazy(() => import('./components/messaging/Messaging'))

export default function Home (): JSX.Element {
  const [consent, setConsent] = useState<boolean>(false)
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  const memoizedPage = useMemo(() => <Page loggedInUser={loggedInUser} />, [loggedInUser])

  return (
    <>
      <CookieConsent setConsent={setConsent} />
      {consent ? (
        <Suspense fallback={memoizedPage}>
          <Auth consent={consent} setLoggedInUser={setLoggedInUser}>
            <Messaging loggedInUser={loggedInUser}>
              {memoizedPage}
            </Messaging>
          </Auth>
        </Suspense>
      ) : (
        memoizedPage
      )}
    </>
  )
}

const Page = ({ loggedInUser }: { loggedInUser: User | null }): JSX.Element => {
  return (
    <FloatingBubbles>
      <Cv loggedInUser={loggedInUser}/>
    </FloatingBubbles>
  )
}