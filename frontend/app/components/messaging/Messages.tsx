import { Message, User } from '@/app/models'
import { Box, Button, Stack, Typography } from '@mui/joy'
import { useMemo } from 'react'
import { ProfileIcon } from '../ProfileIcon'

interface Props {
  className: string
  user: User
  loggedInUser: User
  moreToLoad: boolean
  expanded: boolean
  messages: Message[]
  handleLoadMore: () => void
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export const Messages = ({ className, user, loggedInUser, moreToLoad, expanded, messages, handleLoadMore, messagesEndRef }: Props): JSX.Element => {
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

  let lastMessageDate: string | null = null

  return (
    <Stack className={className} sx={{ display: expanded ? 'flex' : 'none', minHeight: '300px', flex: 1, overflowY: 'auto', padding: 0.5, minWidth: '400px' }} gap={1}>
      {moreToLoad && <Button onClick={handleLoadMore} variant='plain'>Load more</Button>}
      {messages.map((message, index) => {
        const createdAt: Date = new Date(message.createdAt ?? new Date())
        const messageDate = createdAt.toLocaleDateString('en-GB')
        const showDate = messageDate !== lastMessageDate
        lastMessageDate = messageDate

        return (
          <Box key={index}>
            {showDate && (
              <Typography level='body-sm' sx={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {createdAt.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            )}
            <Box
              key={index}
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
                <Typography level='body-sm' sx={{ fontWeight: 'bold' }}>
                  {message.senderId === loggedInUser.id ? 'You' : userName} - {createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography level='body-md' textColor={'var(--foreground)'} sx={{ marginTop: '8px' }}>
                  {message.content}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      })}
      <div ref={messagesEndRef}></div>
    </Stack>
  )
}
