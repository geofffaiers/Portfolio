'use client'
import { useEffect, useRef, useState } from 'react'
import { User } from '../../models'
import Conversations from './Conversations'
import Chats from './Chats'
import { Box, styled } from '@mui/joy'

interface Props {
  children: React.ReactNode
  loggedInUser: User | null
}

enum SocketState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected'
}

interface State {
  socketState: SocketState
  expanded: boolean
  conversations: User[]
  openChats: User[]
  error: string
}

const StyledBox = styled(Box)`
  position: fixed;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  z-index: 4;
  width: 100%;
  height: 0;
  bottom: 0;
  overflow: visible;
  gap: 0.5rem;
`

export const Messaging = ({ children, loggedInUser }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    socketState: SocketState.DISCONNECTED,
    expanded: true,
    conversations: [],
    openChats: [],
    error: ''
  })
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const getConversations = async (): Promise<User[]> => {
      try {
        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messaging/get-conversations`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          signal
        })
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const json = await response.json()
        if (json.success) {
          return json.data as User[]
        }
        throw new Error(json.message ?? 'Failed to get conversations')
      } catch (error: unknown) {
        throw new Error(`${error}`)
      }
    }

    getConversations()
      .then((users: User[]) => {
        setState(s => ({
          ...s,
          conversations: users
        }))
      })
      .catch((error: Error) => {
        setState(s => ({
          ...s,
          error: error.message
        }))
      })
    
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleOpenChat = (user: User) => {
    const openChats: User[] = state.openChats
    if (openChats.includes(user)) {
      return
    }
    setState(s => ({
      ...s,
      openChats: [user, ...s.openChats]
    }))
  }

  const handleCloseChat = (user: User) => {
    setState(s => ({
      ...s,
      openChats: s.openChats.filter(u => u !== user)
    }))
  }

  return (
    <>
      {loggedInUser && (
        <StyledBox paddingInline={1}>
          <Conversations
            loggedInUser={loggedInUser}
            conversations={state.conversations}
            handleOpenChat={handleOpenChat}
          />
          <Chats
            openChats={state.openChats}
            loggedInUser={loggedInUser}
            handleCloseChat={handleCloseChat}
          />
        </StyledBox>
      )}
      {children}
    </>
  )
}
