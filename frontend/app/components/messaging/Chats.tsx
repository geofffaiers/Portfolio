'use client'
import { Message, SocketMessage, User } from '@/app/models'
import { useCallback, useEffect, useState } from 'react'
import Chat from './Chat'

interface Props {
  messages: Message[]
  openChats: User[]
  loggedInUser: User
  handleCloseChat: (user: User) => void
  handleSendSocketMessage: (message: SocketMessage) => void
  addMessages: (messages: Message[]) => void
}

interface State {
  openChats: OpenChat[]
}

interface OpenChat {
  user: User
  expanded: boolean
  msgs: Message[]
}

export default function Chats ({ messages, openChats, loggedInUser, handleCloseChat, handleSendSocketMessage, addMessages }: Props): JSX.Element {
  const [state, setState] = useState<State>({
    openChats: []
  })

  const getMessagesForUser = useCallback((user: User): Message[] => {
    return messages.filter((m: Message) => m.senderId === user.id || m.receiverId === user.id)
  }, [messages])

  useEffect(() => {
    setState(() => ({
      openChats: openChats.map((user) => ({
        user,
        expanded: true,
        msgs: getMessagesForUser(user)
      }))
    }))
  }, [openChats, getMessagesForUser])

  return (
    <>
      {state.openChats.map(({ user, expanded, msgs }: OpenChat, index) => (
        <Chat
          key={index}
          messages={msgs}
          user={user}
          expanded={expanded}
          loggedInUser={loggedInUser}
          closeChat={handleCloseChat}
          handleSendSocketMessage={handleSendSocketMessage}
          addMessages={addMessages}
        />
      ))}
    </>
  )
}
