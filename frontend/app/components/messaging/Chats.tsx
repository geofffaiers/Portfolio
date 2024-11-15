'use client'
import { User } from '@/app/models'
import { useEffect, useState } from 'react'
import Chat from './Chat'

interface Props {
  openChats: User[]
  loggedInUser: User
}

interface State {
  openChats: OpenChat[]
}

interface OpenChat {
  user: User
  expanded: boolean
}

export default function Chats ({ openChats, loggedInUser }: Props): JSX.Element {
  const [state, setState] = useState<State>({
    openChats: []
  })

  console.log(state)

  useEffect(() => {
    setState((s) => ({
      openChats: openChats.map((user) => ({
        user,
        expanded: true
      }))
    }))
  }, [openChats])

  const handleCloseChat = (user: User): void => {
    setState((s) => ({
      openChats: s.openChats.filter((chat) => chat.user.id !== user.id)
    }))
  }

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
