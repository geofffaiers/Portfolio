import { Stack, Typography } from '@mui/joy'
import { ProfileIcon } from '../ProfileIcon'
import { User } from '@/app/models'

interface Props {
  user: User
}

export default function Conversation ({ user }: Props): JSX.Element {
  return (
    <Stack key={user.id} direction='row' spacing={1} alignItems='center' padding={0.5}>
      <ProfileIcon size='lg' user={user} />
      <Typography level='body-sm' component='p' textColor='var(--foreground)'>
        {user.firstName ?? ''} {user.lastName}
      </Typography>
    </Stack>
  )
}