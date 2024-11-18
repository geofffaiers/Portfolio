import { Stack, Typography } from '@mui/joy'
import { ProfileIcon } from '../ProfileIcon'
import { User } from '@/app/models'
import { styled } from '@mui/joy/styles'

interface Props {
  user: User
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
`

export default function Conversation ({ user, handleOpenChat }: Props): JSX.Element {
  const name: string = `${user.firstName ?? 'No first name'} ${user.lastName ?? 'No last name'}`

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleOpenChat(user)
    }
  }
  
  return (
    <StyledStack
      tabIndex={0}
      key={user.id}
      direction='row'
      alignItems='center'
      spacing={1}
      onClick={() => handleOpenChat(user)}
      onKeyDown={handleKeyDown}
    >
      <ProfileIcon size='lg' user={user} />
      <Typography level='body-sm' component='p' className='user-name'>
        {name}
      </Typography>
    </StyledStack>
  )
}