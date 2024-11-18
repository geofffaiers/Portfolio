import { User } from '@/app/models'
import { Box, IconButton, Stack, Typography } from '@mui/joy'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { styled } from '@mui/joy/styles'
import Conversation from './Conversation'
import { ProfileIcon } from '../ProfileIcon'

interface Props {
  loggedInUser: User
  conversations: User[]
  handleOpenChat: (user: User) => void
}

interface State {
  expanded: boolean
}

const StyledBox = styled(Box)`
  display: flex;
  width: 300px;
  flex-direction: column;
  justify-content: flex-end;

  .header,
  .conversations {
    background-color: var(--background);
    border: 1px solid var(--foreground);
    border-bottom: none;
  }

  .header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .conversations {
    border-top: none;
  }
  
  .icon-button {
    color: var(--foreground);
  }
  .icon-button:hover {
    color: var(--background);
  }
`

export default function Conversations ({ loggedInUser, conversations, handleOpenChat }: Props): JSX.Element {
  const [state, setState] = useState<State>({
    expanded: true
  })

  return (
    <StyledBox>
      <Stack className='header' spacing={1} direction='row' alignItems='center' padding={1} sx={{ cursor: 'pointer' }} onClick={() => setState(s => ({ ...s, expanded: !s.expanded }))}>
        <ProfileIcon size='sm' user={loggedInUser} />
        <Typography level='body-sm' component='p' textColor='var(--foreground)'>
          Messaging
        </Typography>
        <IconButton
          className='icon-button'
          aria-label={state.expanded ? 'Collapse' : 'Expand'}
          onClick={(evt) => {
            evt.stopPropagation()
            evt.preventDefault()
            setState(s => ({ ...s, expanded: !s.expanded }))
          }}
          variant='plain'
          size='sm'
          sx={{ marginLeft: 'auto!important' }}
        >
          <FontAwesomeIcon icon={state.expanded ? faChevronDown : faChevronUp}/>
        </IconButton>
      </Stack>
      <Stack className='conversations' spacing={1} sx={{ display: state.expanded ? 'flex' : 'none' }}>
        {conversations.length > 0 && conversations.map((user: User) => (
          <Conversation user={user} key={user.id} handleOpenChat={handleOpenChat}/>
        ))}
        {conversations.length === 0 && (
          <Typography level='body-sm' component='p' textColor='var(--foreground)' padding={1}>
            No conversations
          </Typography>
        )}
      </Stack>
    </StyledBox>
  )
}