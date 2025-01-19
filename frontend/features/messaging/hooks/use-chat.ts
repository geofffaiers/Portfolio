"use client"

import 'reflect-metadata'
import { useState, useEffect, useCallback, useRef } from "react"
import { Message } from "../types/message"
import { useConfigContext } from "@/components/providers/config-provider"
import { BaseMessage, DefaultResponse, MessageType, NewMessage, User } from "@/models"
import { plainToInstance } from "class-transformer"
import { validateOrReject } from "class-validator"
import { useAuthContext } from '@/components/providers/auth-provider'
import { ChatHeader } from '../types/chat-header'
import { useSocketContext } from '@/components/providers/socket-provider'

type UseChat = {
  messages: Message[]
  loading: boolean
  hasMore: boolean
  sendMessage: (content: string) => void
  loadMoreMessages: () => void
  minimized: boolean
  setMinimized: (minimized: boolean) => void
  getSender: (userId: number) => User | null
}

type Props = {
  chatHeader: ChatHeader
}

export function useChat({ chatHeader }: Props): UseChat {
  const { user } = useAuthContext()
  const { config } = useConfigContext()
  const { sendSocketMessage, subscribe, unsubscribe } = useSocketContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [minimized, setMinimized] = useState<boolean>(false)
  const initialLoadRef = useRef<boolean>(true)
  const loadMore = useRef<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const userId = chatHeader.user.id

  const addError = useCallback((message: string) => {
    setMessages((prev) => [...prev, {
      id: -1,
      content: message,
      senderId: -1,
      receiverId: -1,
      createdAt: new Date(),
      isError: true,
    }])
  }, [])

  const handleNewMessages = useCallback((newMessages: Message[]): Message[] => {
    // This isn't remembering the previous messages, `messages` is always empty
    const oldMessages: Message[] = [...messages]
    newMessages.forEach((m: Message) => {
      if (!oldMessages.some((msg: Message) => msg.id === m.id)) {
        oldMessages.push(m)
      }
    })
    oldMessages.sort((a: Message, b: Message) => a.id - b.id)
    return oldMessages
  }, [messages])

  const handleReceiveMessage = useCallback(async (socketMessage: BaseMessage) => {
    try {
      const newMessage: NewMessage = plainToInstance(NewMessage, socketMessage, { excludeExtraneousValues: true })
      await validateOrReject(newMessage)
      const message: Message = plainToInstance(Message, newMessage.message, { excludeExtraneousValues: true })
      await validateOrReject(message)
      setMessages(handleNewMessages([message]))
    } catch (err: unknown) {
      if (err instanceof Error) {
        addError(err.message)
      } else {
        console.error(err)
        addError("An unknown error occurred")
      }
    }
  }, [addError, handleNewMessages])

  const getSender = useCallback((sender: number): User | null => {
    if (sender === user?.id) {
      return user
    } else if (sender === chatHeader.user.id) {
      return chatHeader.user
    } else {
      return null
    }
  }, [chatHeader, user])

  const getMessagesForPage = useCallback(async () => {
    try {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      setLoading(true)
      const response = await fetch(`${config.apiUrl}/messaging/get-messages-for-page?userId=${userId}&page=${page}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        signal
      })
      const json: DefaultResponse<Message[]> = await response.json()
      if (json.success) {
        const messages: Message[] = await Promise.all(json.data.map(async (msg: Message) => {
          const m: Message = plainToInstance(Message, msg, { excludeExtraneousValues: true })
          await validateOrReject(m)
          return m
        }))
        setMessages(handleNewMessages(messages))
        setHasMore(messages.length % 20 === 0)
      } else {
        addError(json.message ?? "Failed to fetch messages")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        addError(err.message)
      } else {
        console.error(err)
        addError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }, [userId, page, addError])

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      getMessagesForPage()
      subscribe(MessageType.NEW_MESSAGE, handleReceiveMessage)
    }
  }, [getMessagesForPage, handleReceiveMessage])

  useEffect(() => {
    if (loadMore.current) {
      loadMore.current = false
      getMessagesForPage()
    }
  }, [getMessagesForPage])

  const sendMessage = useCallback(async (content: string) => {
    const message: Message = new Message()
    message.content = content.trim()
    message.senderId = user?.id ?? -1
    message.receiverId = userId
    const socketMessage: NewMessage = new NewMessage(message)
    sendSocketMessage(socketMessage)
  }, [userId, config.apiUrl])

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loading) {
      loadMore.current = true
      setPage((prev) => prev + 1)
    }
  }, [hasMore, loading])

  return {
    messages,
    loading,
    hasMore,
    sendMessage,
    loadMoreMessages,
    minimized,
    setMinimized,
    getSender,
  }
}
