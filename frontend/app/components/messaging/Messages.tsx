import { Message, User } from "@/app/models"
import { Box, Button, Stack, Typography } from "@mui/joy"
import { useEffect, useState } from "react"

interface Props {
  className: string
  loggedInUser: User
  expanded: boolean
  messages: Message[]
}

interface State {
  page: number
  displayedMessages: Message[]
}

export const Messages = ({ className, loggedInUser, expanded, messages }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    page: 0,
    displayedMessages: []
  })

  const handleLoadMore = (): void => {
  }

  useEffect(() => {
    setState(s => ({
      ...s,
      displayedMessages: messages.slice(s.page * 10, (s.page + 1) * 10)
    }))
  }, [messages, state.page])

  return (
    <Stack className={className} sx={{ display: expanded ? 'flex' : 'none', minHeight: '300px', flex: 1, overflowY: 'auto', padding: 2 }} gap={1}>
      <Button onClick={handleLoadMore} variant='plain'>Load more</Button>
      {state.displayedMessages.map((message, index) => (
        <Box key={index} sx={{ background: 'var(--background)', color: 'var(--foreground)', borderRadius: 5, padding: '0.25rem', border: '1px solid var(--foreground)' }}>
          <Typography level='body-sm' sx={{ fontWeight: 'bold' }}>
            {message.sender}
          </Typography>
          <Typography level='body-md' textColor={'var(--foreground)'}>
            {message.content}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}
