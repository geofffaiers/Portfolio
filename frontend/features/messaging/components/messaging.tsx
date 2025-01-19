"use client"

import { useMessaging } from "../hooks/use-messaging"
import { Conversations } from "./conversations"
import { Chat } from "./chat"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useSocketContext } from "@/components/providers/socket-provider"

export function Messaging() {
  const { user } = useAuthContext()
  const { socket } = useSocketContext()
  const { loading, chatHeaders, openChats, displayConversations, handleOpenChat, handleCloseChat } = useMessaging()

  if (user == null || socket == null) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-4 flex items-end">
      <div className={`flex flex-col h-full justify-end ${displayConversations ? "mr-4" : ""}`}>
        {!loading && (
          <>
            {chatHeaders.map((header) => {
              const chatOpen: boolean = openChats.some(u => u.id === header.user.id)
              if (displayConversations && !chatOpen) return null
              return (
                <Chat key={header.user.id} chatHeader={header} handleCloseChat={handleCloseChat} allowClose={displayConversations}/>
              )
            })}
          </>
        )}
      </div>
      <div className="flex flex-col h-full justify-end">
        <Conversations chatHeaders={chatHeaders} handleOpenChat={handleOpenChat} displayConversations={displayConversations}/>
      </div>
    </div>
  )
}
