import { Box, IconButton, Input, Stack, styled, Typography } from '@mui/joy'
import { faPaperPlane, faWindowMaximize, faWindowMinimize, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Messages } from './Messages'
import { User } from '@/app/models'
import { useMemo, useState } from 'react'
import { ProfileIcon } from '../ProfileIcon'

interface Props {
  user: User
  expanded: boolean
  loggedInUser: User
  closeChat: (user: User) => void
}

const StyledBox = styled(Box)`
  display: flex;
  min-width: 300px;
  flex-direction: column;
  justify-content: flex-end;

  .icon-button {
    color: var(--foreground);
  }
  .icon-button:hover {
    color: var(--background);
  }

  .header,
  .messages,
  .new-message {
    background-color: var(--background);
    border: 1px solid var(--foreground);
    border-bottom: none;
  }

  .header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .messages {
    border-top: none;
  }
  
`

export default function Chat ({ user, expanded, loggedInUser, closeChat }: Props): JSX.Element {
  const [state, setState] = useState({
    expanded,
    messages: [],
    newMessage: ''
  })
  
  const name: string = useMemo(() => `${user.firstName ?? 'No first name'} ${user.lastName ?? 'No last name'}`, [user])

  const handleSendMessage = async () => {

  }

  return (
    <StyledBox>
      <Box className='header' sx={{ padding: 1, borderBottom: '1px solid var(--foreground)' }}>
        <Stack direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
          <ProfileIcon size='sm' user={user} />
          <Typography level='body-sm' component='p' textColor='var(--foreground)'>
            {name}
          </Typography>
          <IconButton
            className='icon-button'
            aria-label={state.expanded ? 'Collapse' : 'Expand'}
            onClick={() => setState(s => ({ ...s, expanded: !s.expanded }))}
            variant='plain'
            size='sm'
            sx={{ marginLeft: 'auto!important' }}
          >
            <FontAwesomeIcon icon={state.expanded ? faWindowMinimize : faWindowMaximize}/>
          </IconButton>
          <IconButton
            className='icon-button'
            aria-label={state.expanded ? 'Collapse' : 'Expand'}
            onClick={() => closeChat(user)}
            variant='plain'
            size='sm'
          >
            <FontAwesomeIcon icon={faX}/>
          </IconButton>
        </Stack>
      </Box>
      <Messages className='messages' loggedInUser={loggedInUser} expanded={state.expanded} messages={state.messages}/>
      <Box className='new-message' sx={{ display: state.expanded ? 'flex' : 'none', padding: 2, borderTop: '1px solid var(--foreground)' }}>
        <Stack direction='row' spacing={1} sx={{ maxWidth: '100%' }}>
          <Input
            sx={{ flex: 1 }}
            value={state.newMessage}
            onChange={(e) => setState(s => ({ ...s, newMessage: e.target.value }))}
            placeholder='Type a message...'
          />
          <IconButton onClick={handleSendMessage} variant='solid' color='primary'>
            <FontAwesomeIcon icon={faPaperPlane}/>
          </IconButton>
        </Stack>
      </Box>
    </StyledBox>
  )
}