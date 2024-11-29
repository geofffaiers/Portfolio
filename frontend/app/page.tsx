'use client'
import { useState } from 'react'
import { Cv, FloatingBubbles, Auth, Messaging, CookieConsent } from './components'
import { User } from './models'

export default function Home (): JSX.Element {
  const [consent, setConsent] = useState<boolean>(false)
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  return (
    <>
      <CookieConsent setConsent={setConsent} />
      <Auth consent={consent} setLoggedInUser={setLoggedInUser}>
        <Messaging loggedInUser={loggedInUser}>
          <FloatingBubbles>
            <Cv loggedInUser={loggedInUser}/>
          </FloatingBubbles>
        </Messaging>
      </Auth>
    </>
  )
}
