import { Message, MessageType, ReadMessage, SocketMessage, User } from '@/app/models'
import { Box, Typography } from '@mui/joy'
import { useEffect, useMemo, useRef } from 'react'
import { ProfileIcon } from '../ProfileIcon'

interface Props {
  user: User
  loggedInUser: User
  message: Message
  createdAt: Date
  showDate: boolean
  handleSendSocketMessage: (message: SocketMessage) => void
}

export const SingleMessage = ({ user, loggedInUser, message, createdAt, showDate, handleSendSocketMessage }: Props): JSX.Element => {
  const messageRef = useRef<IntersectionObserver | null>(null)

  const userName = useMemo((): string => {
    if (user.firstName != null && user.lastName != null) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName != null) {
      return user.firstName
    }
    if (user.lastName != null) {
      return user.lastName
    }
    return user.username
  }, [user])

  const readAtTitle = useMemo((): string => {
    if (message.readAt != null) {
      return `Read: ${message.readAt}`
    }
    return 'Unread'
  }, [message.readAt])

  useEffect(() => {
    messageRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (message.readAt == null) {
            if (entry.isIntersecting) {
              const socketMessage: ReadMessage = { type: MessageType.READ_MESSAGE, messageId: message.id }
              handleSendSocketMessage(socketMessage)
            }
          } else {
            messageRef.current?.disconnect()
          }
        })
      },
      { threshold: 1.0 }
    )

    return () => {
      if (messageRef.current) {
        messageRef.current.disconnect()
      }
    }
  }, [message, handleSendSocketMessage])


  const setObserver = (element: HTMLElement | null): void => {
    if (messageRef.current != null && element != null && message.receiverId === loggedInUser.id && message.readAt == null) {
      messageRef.current.observe(element)
    }
  }

  return (
    <Box data-message-id={message.id} ref={setObserver}>
      {showDate && (
        <Typography level='body-sm' sx={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          {createdAt.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          background: 'var(--background)',
          color: 'var(--foreground)',
          padding: '0.25rem',
        }}
      >
        <ProfileIcon size='sm' user={message.senderId === loggedInUser.id ? loggedInUser : user} />
        <Box sx={{ marginLeft: 1, flex: 1 }}>
          <Typography level='body-sm' sx={{ fontWeight: 'normal' }} title={readAtTitle}>
            {message.senderId === loggedInUser.id ? 'You' : userName} - {createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography level='body-md' textColor={'var(--foreground)'} sx={{ marginTop: '8px' }}>
            {message.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
