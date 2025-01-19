import { ChatHeader, User } from '@/app.old/models'
import { Box, Stack, Typography } from '@mui/joy'
import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { styled } from '@mui/joy/styles'
import Conversation from './Conversation'
import { ProfileIcon } from '../ProfileIcon'
import { usePageContext } from '@/app.old/context'
import { Button } from '@/components/ui/button'

interface Props {
  chatHeaders: ChatHeader[]
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
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  }
  .header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .conversations {
    border-top: none;
  }
`

export default function Conversations ({ chatHeaders, handleOpenChat }: Props): JSX.Element {
  const { loggedInUser, play} = usePageContext()
  const [state, setState] = useState<State>({
    expanded: true
  })

  useEffect(() => {
    setState(s => ({ ...s, expanded: !play }))
  }, [play])

  const sortedHeaders = useMemo(() => {
    return chatHeaders.sort((a, b) => {
      if (a.lastMessage == null || b.lastMessage == null) {
        return -1
      }
      if (a.lastMessage.createdAt == null || b.lastMessage.createdAt == null) {
        return -1
      }
      return a.lastMessage.createdAt > b.lastMessage.createdAt ? -1 : 1
    })
  }, [chatHeaders])

  return (
    <StyledBox>
      <Stack className='header' gap='0.5rem' direction='row' alignItems='center' padding={1} sx={{ cursor: 'pointer' }} onClick={() => setState(s => ({ ...s, expanded: !s.expanded }))}>
        <ProfileIcon size='sm' user={loggedInUser} />
        <Typography level='body-sm' component='p' textColor='var(--foreground)'>
          Messaging
        </Typography>
        <Button
          className='ml-auto'
          aria-label={state.expanded ? 'Collapse' : 'Expand'}
          onClick={(evt) => {
            evt.stopPropagation()
            evt.preventDefault()
            setState(s => ({ ...s, expanded: !s.expanded }))
          }}
          variant='ghost'
          size='icon'
        >
          <FontAwesomeIcon icon={state.expanded ? faChevronDown : faChevronUp}/>
        </Button>
      </Stack>
      <Stack className='conversations' spacing={1} sx={{ display: state.expanded ? 'flex' : 'none' }}>
        {sortedHeaders.length > 0 && sortedHeaders.map((chatHeader: ChatHeader) => (
          <Conversation chatHeader={chatHeader} key={chatHeader.user.id} handleOpenChat={handleOpenChat}/>
        ))}
        {sortedHeaders.length === 0 && (
          <Typography level='body-sm' component='p' textColor='var(--foreground)' padding={1}>
            No conversations
          </Typography>
        )}
      </Stack>
    </StyledBox>
  )
}