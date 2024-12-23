'use client'
import 'reflect-metadata'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatHeader, DefaultResponse, ErrorMessage, Message, MessageType, NewMessage, SocketMessage, UpdatedProfile, User } from '../../models'
import Conversations from './Conversations'
import Chats from './Chats'
import { Box, styled } from '@mui/joy'
import { plainToInstance } from 'class-transformer'
import { getApiUrl, getWsUrl } from '@/app/helpers'
import { usePageContext } from '@/app/context'

interface Props {
  children: React.ReactNode
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

export default function Messaging ({ children }: Props): JSX.Element {
  const { loggedInUser, setLoggedInUser } = usePageContext()
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
  const prevUserIdRef = useRef<number | null>(null)

  useEffect(() => {
    const getConversations = async (): Promise<ChatHeader[]> => {
      try {
        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current
        const response = await fetch(`${getApiUrl()}/messaging/get-chat-headers`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          signal
        })
        const json: DefaultResponse<ChatHeader[]> = await response.json()
        if (json.success) {
          return json.data
        }
        throw new Error(json.message ?? 'Failed to get conversations')
      } catch (error: unknown) {
        throw new Error(`${error}`)
      }
    }

    if (loggedInUser) {
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
    }
    
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort()
      }
    }
  }, [loggedInUser])

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
          return plainToInstance(ChatHeader, newHeader, { excludeExtraneousValues: true })
        }
        return chatHeader
      })
    }))
  }, [])

  useEffect(() => {
    if (loggedInUser != null && loggedInUser.id !== prevUserIdRef.current) {
      prevUserIdRef.current = loggedInUser.id
      if (socketRef.current != null) {
        socketRef.current.close()
      }
      socketRef.current = new WebSocket(`${getWsUrl()}`)
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
          case MessageType.UPDATED_PROFILE:
            const profileUpdatedRequest: UpdatedProfile = plainToInstance(UpdatedProfile, message, { excludeExtraneousValues: true })
            setLoggedInUser(profileUpdatedRequest.user)
            break
          case MessageType.DELETE_PROFILE:
            setLoggedInUser(null)
            break
          default:
            console.error('No route found for message:', message)
        }
      }
    }
    return () => {
      if (socketRef.current != null && (loggedInUser == null || loggedInUser.id !== prevUserIdRef.current)) {
        socketRef.current.close()
      }
    }
  }, [addMessages, updateChatHeaders, setLoggedInUser, loggedInUser])

  const handleSendSocketMessage = (message: SocketMessage): void => {
    if (socketRef.current != null) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  const handleOpenChat = (user: User) => {
    const openChats: User[] = state.openChats
    const index: number = openChats.findIndex(u => u.id === user.id)
    if (index === -1) {
      setState(s => ({
        ...s,
        openChats: [...s.openChats, user]
      }))
    }
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
            chatHeaders={state.chatHeaders}
            handleOpenChat={handleOpenChat}
          />
          <Chats
            messages={state.messages}
            openChats={state.openChats}
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
