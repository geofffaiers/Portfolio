'use client'
import { useState, useMemo } from 'react'
import { Cv, CookieConsent, Game } from './components'
import { PageProvider } from './context'
import Auth from './components/auth/Auth'
import Messaging from './components/messaging/Messaging'

export default function Home (): JSX.Element {
  const [consent, setConsent] = useState<boolean>(false)
  const memoizedPage = useMemo(() => <Page/>, [])

  return (
    <>
      <PageProvider>
        <CookieConsent setConsent={setConsent} />
        {consent ? (
          <Auth>
            <Messaging>
              {memoizedPage}
            </Messaging>
          </Auth>
        ) : (
          memoizedPage
        )}
      </PageProvider>
    </>
  )
}

const Page = (): JSX.Element => {
  return (
    <Game>
      <Cv/>
    </Game>
  )
}