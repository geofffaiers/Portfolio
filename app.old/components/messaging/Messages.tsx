import { Message, SocketMessage, User } from '@/app.old/models'
import { Stack } from '@mui/joy'
import { SingleMessage } from './SingleMessage'
import { Button } from '@/components/ui/button'

interface Props {
  className: string
  user: User
  moreToLoad: boolean
  expanded: boolean
  messages: Message[]
  handleLoadMore: () => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  handleSendSocketMessage: (message: SocketMessage) => void
}

export const Messages = ({ className, user, moreToLoad, expanded, messages, handleLoadMore, messagesEndRef, handleSendSocketMessage }: Props): JSX.Element => {
  let lastMessageDate: string | null = null

  return (
    <Stack className={className} sx={{ display: expanded ? 'flex' : 'none', minHeight: '300px', flex: 1, overflowY: 'auto', padding: 0.5, minWidth: '400px' }} gap={1}>
      {moreToLoad && <Button onClick={handleLoadMore} variant='link'>Load more</Button>}
      {messages.map(message => {
        const createdAt: Date = new Date(message.createdAt ?? new Date())
        const messageDate = createdAt.toLocaleDateString('en-GB')
        const showDate = messageDate !== lastMessageDate
        lastMessageDate = messageDate
        return (
          <SingleMessage key={message.id} user={user} message={message} handleSendSocketMessage={handleSendSocketMessage} createdAt={createdAt} showDate={showDate} />
        )
      })}
      <div ref={messagesEndRef}></div>
    </Stack>
  )
}
