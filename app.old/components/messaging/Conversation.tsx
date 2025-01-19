import { Box, Stack, Typography } from '@mui/joy'
import { ProfileIcon } from '../ProfileIcon'
import { ChatHeader, User } from '@/app.old/models'
import { styled } from '@mui/joy/styles'
import { useMemo } from 'react'
import { usePageContext } from '@/app.old/context'

interface Props {
  chatHeader: ChatHeader
  handleOpenChat: (user: User) => void
}

const StyledStack = styled(Stack)`
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    background-color: var(--background-hover);
  }
  .user-name {
    color: var(--foreground);
  }
  .last-message {
    color: var(--foreground-secondary);
  }
  .unread-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--foreground);
    margin-left: 0.5rem;
  }
`

export default function Conversation ({ chatHeader, handleOpenChat }: Props): JSX.Element {
  const { loggedInUser } = usePageContext()
  const { user, lastMessage, lastReceivedMessage } = chatHeader
  const userName: string = useMemo((): string => {
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

  const lastMessageSender = useMemo((): string => {
    if (lastMessage == null) {
      return ''
    }
    if (lastMessage.senderId === loggedInUser?.id) {
      return 'You: '
    }
    return `${userName}: `
  }, [loggedInUser, lastMessage, userName])

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleOpenChat(user)
    }
  }

  const lastReceivedMessageRead: boolean = lastReceivedMessage != null ? lastReceivedMessage.readAt != null : true
  return (
    <StyledStack
      tabIndex={0}
      key={user.id}
      direction='row'
      alignItems='center'
      gap={1}
      onClick={() => handleOpenChat(user)}
      onKeyDown={handleKeyDown}
    >
      <ProfileIcon size='lg' user={user} />
      <Stack direction='column' alignItems='flex-start' justifyContent='space-between' flex={1}>
        <Typography level='body-sm' component='p' className='user-name' sx={{ fontWeight: lastReceivedMessageRead ? 'normal' : 'bold' }}>
          {userName}
        </Typography>
        {lastMessage != null && (
          <Typography level='body-xs' component='p' className='last-message'>
            {`${lastMessageSender} ${lastMessage.content}`}
          </Typography>
        )}
      </Stack>
      {!lastReceivedMessageRead && <Box className='unread-dot' />}
    </StyledStack>
  )
}