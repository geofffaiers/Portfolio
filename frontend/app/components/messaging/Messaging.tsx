'use client'
import 'reflect-metadata'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatHeader, ErrorMessage, Message, MessageType, NewMessage, SocketMessage, User } from '../../models'
import Conversations from './Conversations'
import Chats from './Chats'
import { Box, styled } from '@mui/joy'
import { plainToInstance } from 'class-transformer'

interface Props {
  children: React.ReactNode
  loggedInUser: User | null
}

enum SocketState {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected'
}

interface State {
  socketState: SocketState
  expanded: boolean
  chatHeaders: ChatHeader[]
  openChats: User[]
  messages: Message[]
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
    chatHeaders: [],
    openChats: [],
    messages: [],
    error: ''
  })
  const abortControllerRef = useRef<AbortController | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const getConversations = async (): Promise<ChatHeader[]> => {
      try {
        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messaging/get-chat-headers`, {
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
          return json.data as ChatHeader[]
        }
        throw new Error(json.message ?? 'Failed to get conversations')
      } catch (error: unknown) {
        throw new Error(`${error}`)
      }
    }

    getConversations()
      .then((users: ChatHeader[]) => {
        setState(s => ({
          ...s,
          chatHeaders: users
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

  const handleNewMessages = useCallback((oldMessages: Message[], newMessages: Message[]): Message[] => {
    const messageMap = new Map(oldMessages.map(msg => [msg.id, msg]))
    newMessages.forEach((m: Message) => {
      messageMap.set(m.id, m)
    })
    const msgs = Array.from(messageMap.values())
    msgs.sort((a: Message, b: Message) => a.id - b.id)
    return msgs
  }, [])

  const addMessages = useCallback((messages: Message[]): void => {
    setState(s => ({
      ...s,
      messages: handleNewMessages(s.messages, messages)
    }))
  }, [handleNewMessages])

  const updateChatHeaders = useCallback((message: Message): void => {
    setState(s => ({
      ...s,
      chatHeaders: s.chatHeaders.map((chatHeader: ChatHeader) => {
        if (chatHeader.user.id === message.senderId || chatHeader.user.id === message.receiverId) {
          const newHeader: ChatHeader = { ...chatHeader }
          if (newHeader.lastMessage == null || newHeader.lastMessage.id <= message.id) {
            newHeader.lastMessage = message
          }
          if (chatHeader.user.id === message.senderId) {
            if (newHeader.lastReceivedMessage != null && newHeader.lastReceivedMessage.id <= message.id) {
              newHeader.lastReceivedMessage = message
            }
          }
          return newHeader
        }
        return chatHeader
      })
    }))
  }, [])

  useEffect(() => {
    if (loggedInUser) {
      socketRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/api/messaging`)
      socketRef.current.onopen = () => {
        setState(s => ({
          ...s,
          socketState: SocketState.CONNECTED
        }))
      }
      socketRef.current.onclose = () => {
        setState(s => ({
          ...s,
          socketState: SocketState.DISCONNECTED
        }))
      }
      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setState(s => ({
          ...s,
          socketState: SocketState.DISCONNECTED,
          error: 'WebSocket error'
        }))
      }
      socketRef.current.onmessage = (event) => {
        const message: SocketMessage = JSON.parse(event.data)
        switch (message.type) {
          case MessageType.ERROR:
            const errorRequest: ErrorMessage = plainToInstance(ErrorMessage, message, { excludeExtraneousValues: true })
            console.error('Socket error:', errorRequest)
            break
          case MessageType.NEW_MESSAGE:
            const newMessageRequest: NewMessage = plainToInstance(NewMessage, message, { excludeExtraneousValues: true })
            addMessages([newMessageRequest.message])
            updateChatHeaders(newMessageRequest.message)
            break
          case MessageType.UPDATED_MESSAGE:
            const updatedMessageRequest: NewMessage = plainToInstance(NewMessage, message, { excludeExtraneousValues: true })
            addMessages([updatedMessageRequest.message])
            updateChatHeaders(updatedMessageRequest.message)
            break
          default:
            console.error('No route found for message:', message)
        }
      }
    }
    return () => {
      if (socketRef.current != null) {
        socketRef.current.close()
      }
    }
  }, [addMessages, updateChatHeaders, loggedInUser])

  const handleSendSocketMessage = (message: SocketMessage): void => {
    if (socketRef.current != null) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

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
            chatHeaders={state.chatHeaders}
            handleOpenChat={handleOpenChat}
          />
          <Chats
            messages={state.messages}
            openChats={state.openChats}
            loggedInUser={loggedInUser}
            handleCloseChat={handleCloseChat}
            handleSendSocketMessage={handleSendSocketMessage}
            addMessages={addMessages}
          />
        </StyledBox>
      )}
      {children}
    </>
  )
}
