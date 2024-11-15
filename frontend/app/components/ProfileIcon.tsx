import { Avatar, Box } from "@mui/joy"
import { User } from "../models"

interface Props {
  user: User
  size: 'sm' | 'md' | 'lg'
}

export const ProfileIcon = ({ user, size = 'md' }: Props): JSX.Element => {
  const name: string = `${user.firstName ?? '?'} ${user.lastName ?? '?'}`
  const initials: string = name.split(' ').map((n: string) => n[0]).join('')
  
  return (
    <Box>
      <Avatar size={size} alt={name} src={user.profilePicture}>
        {initials}
      </Avatar>
    </Box>
  )
}
