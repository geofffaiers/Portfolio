'use client'
import { useState } from 'react'
import { Cv, FloatingBubbles, Auth, Messaging } from './components'
import { User } from './models'

export default function Home (): JSX.Element {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  return (
    <Auth setLoggedInUser={setLoggedInUser}>
      <Messaging loggedInUser={loggedInUser}>
        <FloatingBubbles>
          <Cv loggedInUser={loggedInUser}/>
        </FloatingBubbles>
      </Messaging>
    </Auth>
  )
}
