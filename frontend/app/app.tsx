
'use client'
import { PageProvider } from './context'
import { CookieConsent } from './components/CookieConsent'
import Auth from './components/auth/Auth'
import Messaging from './components/messaging/Messaging'
import { useState } from 'react'
import { Game } from './components'

export default function App({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<boolean>(false)
  return (
    <PageProvider>
      <CookieConsent setConsent={setConsent}/>
      {consent && (
        <Auth>
          <Messaging>
              <Game>
                {children}
              </Game>
          </Messaging>
        </Auth>
      )}
    </PageProvider>
  )
}