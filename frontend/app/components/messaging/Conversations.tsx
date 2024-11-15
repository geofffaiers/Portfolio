import { User } from "@/app/models"
import { Box, IconButton, Stack, Typography } from "@mui/joy"
import { ProfileIcon } from "../ProfileIcon"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import Conversation from "./Conversation"

interface Props {
  loggedInUser: User
  conversations: User[]
}

interface State {
  expanded: boolean
}

export default function Conversations ({ loggedInUser, conversations }: Props): JSX.Element {
  const [state, setState] = useState<State>({ expanded: true })

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '300px',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--foreground)',
        borderBottom: 'none',
        bottom: 0,
        right: 5,
        zIndex: 4,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack spacing={1} direction='row' alignItems='center' padding={0.5} sx={{ cursor: 'pointer' }} onClick={() => setState(s => ({ ...s, expanded: !s.expanded }))}>
        <ProfileIcon size='sm' user={loggedInUser} />
        <Typography level='body-sm' component='p' textColor='var(--foreground)'>
          Messaging
        </Typography>
        <IconButton
          aria-label={state.expanded ? 'Collapse' : 'Expand'}
          onClick={(evt) => {
            evt.stopPropagation()
            evt.preventDefault()
            setState(s => ({ ...s, expanded: !s.expanded }))
          }}
          variant='plain'
          color='primary'
          sx={{ marginLeft: 'auto!important' }}
        >
          <FontAwesomeIcon icon={state.expanded ? faChevronDown : faChevronUp}/>
        </IconButton>
      </Stack>
      <Stack spacing={1} padding={1} sx={{ display: state.expanded ? 'flex' : 'none' }}>
        {conversations.length > 0 && conversations.map((user: User) => (
          <Conversation user={user} key={user.id}/>
        ))}
        {conversations.length === 0 && (
          <Typography level='body-sm' component='p' textColor='var(--foreground)'>
            No conversations
          </Typography>
        )}
      </Stack>
    </Box>
  )
}