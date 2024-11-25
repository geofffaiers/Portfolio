'use client'
import 'reflect-metadata'
import { Box, IconButton, Input, Stack, styled, Typography } from '@mui/joy'
import { faPaperPlane, faWindowMaximize, faWindowMinimize, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Messages } from './Messages'
import { Message, NewMessage, SocketMessage, User } from '@/app/models'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ProfileIcon } from '../ProfileIcon'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

interface Props {
  messages: Message[]
  user: User
  expanded: boolean
  loggedInUser: User
  closeChat: (user: User) => void
  handleSendSocketMessage: (message: SocketMessage) => void
  addMessages: (messages: Message[]) => void
}

interface State {
  page: number
  expanded: boolean
  moreToLoad: boolean
  scrollDown: boolean
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
    border: 1px solid var(--foreground);
    border-bottom: none;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  }
  .header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .messages {
    border-top: none;
  }
`

export default function Chat ({ messages, user, expanded, loggedInUser, closeChat, handleSendSocketMessage, addMessages }: Props): JSX.Element {
  const [state, setState] = useState<State>({
    page: 0,
    expanded,
    moreToLoad: true,
    scrollDown: true,
    newMessage: '',
    error: ''
  })
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialLoadRef = useRef<boolean>(true)
  const loadMore = useRef<boolean>(false)

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

  const handleSendMessage = async () => {
    if (state.newMessage.trim() === '') {
      return
    }
    const message: Message = new Message()
    message.content = state.newMessage.trim()
    message.senderId = loggedInUser.id
    message.receiverId = user.id
    setState(s => ({ ...s, newMessage: '', scrollDown: true }))
    const socketMessage: NewMessage = new NewMessage(message)
    handleSendSocketMessage(socketMessage)
  }

  const handleNewMessages = useCallback((newMessages: Message[]): Message[] => {
    const oldMessages: Message[] = [...messages]
    newMessages.forEach((m: Message) => {
      if (!oldMessages.some((msg: Message) => msg.id === m.id)) {
        oldMessages.push(m)
      }
    })
    oldMessages.sort((a: Message, b: Message) => a.id - b.id)
    return oldMessages
  }, [messages])
  
  const getMessagesForPage = useCallback(async (u: User) => {
    try {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      const response = await fetch(`/api/messaging/get-messages-for-page?userId=${u.id}&page=${state.page}`, {
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
          moreToLoad: json.data.length % 20 === 0
        }))
        const messages: Message[] = await Promise.all(json.data.map(async (msg: Message) => {
          const m: Message = plainToInstance(Message, msg, { excludeExtraneousValues: true })
          await validateOrReject(m)
          return m
        }))
        addMessages(handleNewMessages(messages))
      }
      setState(s => ({ ...s, error: json.message ?? 'Failed to get conversations' }))
    } catch (error: unknown) {
      setState(s => ({ ...s, error: `${error}` }))
    }
  }, [addMessages, handleNewMessages, state.page])

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      getMessagesForPage(user)
    }
  }, [getMessagesForPage, user])

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  useEffect(() => {
    if (state.scrollDown) {
      scrollToBottom()
    }
  }, [messages, state.scrollDown])

  const handleLoadMore = () => {
    loadMore.current = true
    setState(s => ({ ...s, page: s.page + 1, scrollDown: false }))
  }

  useEffect(() => {
    if (loadMore.current) {
      loadMore.current = false
      getMessagesForPage(user)
    }
  }, [getMessagesForPage, user])

  return (
    <StyledBox>
      <Box className='header' sx={{ padding: 1, borderBottom: '1px solid var(--foreground)' }}>
        <Stack direction='row' gap={1} justifyContent='space-between' alignItems='center'>
          <ProfileIcon size='sm' user={user} />
          <Typography level='body-sm' component='p' textColor='var(--foreground)'>
            {userName}
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
      <Messages
        className='messages'
        user={user}
        loggedInUser={loggedInUser}
        expanded={state.expanded}
        messages={messages}
        handleLoadMore={handleLoadMore}
        messagesEndRef={messagesEndRef}
        moreToLoad={state.moreToLoad}
        handleSendSocketMessage={handleSendSocketMessage}
      />
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