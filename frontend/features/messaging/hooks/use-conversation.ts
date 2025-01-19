"use client"

import { useMemo, useState } from "react"
import { ChatHeader } from "../types/chat-header"

type UseConversation = {
  sortedHeaders: ChatHeader[]
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

export function useConversation({ chatHeaders }: { chatHeaders: ChatHeader[] }): UseConversation {
  const [expanded, setExpanded] = useState<boolean>(true)
  const sortedHeaders = useMemo(() => {
    return chatHeaders.sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) return -1
      if (!a.lastMessage.createdAt || !b.lastMessage.createdAt) return -1
      return a.lastMessage.createdAt > b.lastMessage.createdAt ? -1 : 1
    })
  }, [chatHeaders])

  return {
    sortedHeaders,
    expanded,
    setExpanded,
  }
}
