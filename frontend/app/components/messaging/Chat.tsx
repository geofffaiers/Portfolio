import { Box, IconButton, Input, Stack, Typography } from '@mui/joy'
import { faPaperPlane, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Messages } from './Messages'

export default function Chat (): JSX.Element {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '300px',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--foreground)',
        bottom: 0,
        right: 20,
        zIndex: 4,
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ padding: 2, borderBottom: '1px solid var(--foreground)' }}>
        <Stack direction='row' spacing={1} justifyContent={'space-between'}>
          <Typography level='h4' component='h2' textColor={'var(--foreground)'}>
            Messaging
          </Typography>
          <IconButton
            aria-label={state.expanded ? 'Collapse' : 'Expand'}
            onClick={() => setState(s => ({ ...s, expanded: !s.expanded }))}
            variant='solid'
          >
            <FontAwesomeIcon icon={state.expanded ? faWindowMinimize : faWindowMaximize}/>
          </IconButton>
        </Stack>
      </Box>
      <Messages loggedInUser={loggedInUser} expanded={state.expanded} messages={state.messages}/>
      <Box sx={{ display: state.expanded ? 'flex' : 'none', padding: 2, borderTop: '1px solid var(--foreground)' }}>
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
    </Box>
  )
}