'use client'
import { useEffect, useRef, useState } from 'react'
import { User } from '../../models'
import Conversations from './Conversations'

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
  error: string
}

export const Messaging = ({ children, loggedInUser }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    socketState: SocketState.DISCONNECTED,
    expanded: true,
    conversations: [],
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

  return (
    <>
      {loggedInUser && (
        <>
          <Conversations loggedInUser={loggedInUser} conversations={state.conversations}/>
        </>
      )}
      {children}
    </>
  )
}
