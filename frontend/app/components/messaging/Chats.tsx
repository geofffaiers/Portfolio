'use client'
import { User } from '@/app/models'
import { useEffect, useState } from 'react'
import Chat from './Chat'

interface Props {
  openChats: User[]
  loggedInUser: User
  handleCloseChat: (user: User) => void
}

interface State {
  openChats: OpenChat[]
}

interface OpenChat {
  user: User
  expanded: boolean
}

export default function Chats ({ openChats, loggedInUser, handleCloseChat }: Props): JSX.Element {
  const [state, setState] = useState<State>({
    openChats: []
  })

  useEffect(() => {
    setState(() => ({
      openChats: openChats.map((user) => ({
        user,
        expanded: true
      }))
    }))
  }, [openChats])

  return (
    <>
      {state.openChats.map(({ user, expanded }: OpenChat, index) => (
        <Chat
          key={index}
          user={user}
          expanded={expanded}
          loggedInUser={loggedInUser}
          closeChat={handleCloseChat}
        />
      ))}
    </>
  )
}
