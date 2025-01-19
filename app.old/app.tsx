
'use client'
import { PageProvider } from './context'
import { CookieConsent } from './components/CookieConsent'
import Auth from './components/auth/Auth'
import Messaging from './components/messaging/Messaging'
import { useEffect, useState } from 'react'
import { Game } from './components'
import { Toaster } from '@/components/ui/toaster'

export default function App({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<boolean>(false)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

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
      <Toaster />
    </PageProvider>
  )
}