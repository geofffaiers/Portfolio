'use client'
import { useEffect, useState } from 'react'
import { Cv, FloatingBubbles, Auth, Messaging } from './components'
import { User } from './models'

interface State {
  readingFromLocalStorage: boolean
}

export default function Home (): JSX.Element {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [state, setState] = useState<State>({
    readingFromLocalStorage: true
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser')
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser))
    }
    setState(s => ({
      ...s,
      readingFromLocalStorage: false
    }))
  }, [])

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    } else {
      localStorage.removeItem('loggedInUser')
    }
  }, [loggedInUser])

  return (
    <Auth readingFromLocalStorage={state.readingFromLocalStorage} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}>
      <Messaging loggedInUser={loggedInUser}>
        <FloatingBubbles>
          <Cv />
        </FloatingBubbles>
      </Messaging>
    </Auth>
  )
}
