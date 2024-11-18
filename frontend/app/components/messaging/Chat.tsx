import { Box, IconButton, Input, Stack, styled, Typography } from '@mui/joy'
import { faPaperPlane, faWindowMaximize, faWindowMinimize, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Messages } from './Messages'
import { Message, User } from '@/app/models'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProfileIcon } from '../ProfileIcon'

interface Props {
  user: User
  expanded: boolean
  loggedInUser: User
  closeChat: (user: User) => void
}

interface State {
  page: number
  expanded: boolean
  moreToLoad: boolean
  messages: Message[]
  newMessage: string
  error: string
}

const StyledBox = styled(Box)`
  display: flex;
  min-width: 200px;
  max-width: 400px;
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
    border: 1px solid var(--background);
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
  const [state, setState] = useState<State>({
    page: 0,
    expanded,
    moreToLoad: true,
    messages: [],
    newMessage: '',
    error: ''
  })
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialLoadRef = useRef<boolean>(true)
  
  const name: string = useMemo(() => `${user.firstName ?? 'No first name'} ${user.lastName ?? 'No last name'}`, [user])

  const handleSendMessage = async () => {

  }

  const handleNewMessages = (oldMessages: Message[], newMessages: Message[]): Message[] => {
    const messages: Message[] = [...oldMessages]
    newMessages.forEach((m: Message) => {
      if (!messages.some((msg: Message) => msg.id === m.id)) {
        messages.push(m)
      }
    })
    messages.sort((a: Message, b: Message) => a.id - b.id)
    return messages
  }
  
  useEffect(() => {
    const getMessagesForPage = async () => {
      try {
        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messaging/get-messages-for-page?userId=${user.id}&page=${state.page}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          signal
        })
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const json = await response.json()
        if (json.success) {
          setState(s => ({
            ...s,
            error: '',
            moreToLoad: json.data.length % 20 === 0,
            messages: handleNewMessages(s.messages, json.data)
          }))
        }
        setState(s => ({ ...s, error: json.message ?? 'Failed to get conversations' }))
      } catch (error: unknown) {
        setState(s => ({ ...s, error: `${error}` }))
      }
    }

    getMessagesForPage()
  }, [user, state.page])

  const scrollToBottom = (): void => {
    console.log(messagesEndRef.current)
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  useEffect(() => {
    if (initialLoadRef.current && state.messages.length > 0) {
      scrollToBottom()
      initialLoadRef.current = false
    }
  }, [state.messages])

  const handleLoadMore = () => {
    setState(s => ({ ...s, page: s.page + 1 }))
  }

  return (
    <StyledBox>
      <Box className='header' sx={{ padding: 1, borderBottom: '1px solid var(--foreground)' }}>
        <Stack direction='row' gap={1} justifyContent='space-between' alignItems='center'>
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
      <Messages className='messages' user={user} loggedInUser={loggedInUser} expanded={state.expanded} messages={state.messages} handleLoadMore={handleLoadMore} messagesEndRef={messagesEndRef} moreToLoad={state.moreToLoad}/>
      <Box className='new-message' sx={{ display: state.expanded ? 'flex' : 'none', padding: 2, borderTop: '1px solid var(--foreground)' }}>
        <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
          <Input
            sx={{ flex: 1, width: '100%' }}
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