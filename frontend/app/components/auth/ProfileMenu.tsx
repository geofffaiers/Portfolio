import { Button, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy'
import { ProfileIcon } from '../ProfileIcon'
import { usePageContext } from '@/app/context'
import styled from '@emotion/styled'
import { useRouter, usePathname } from 'next/navigation'
import { UseProfileMenu, useProfileMenu } from './hooks/useProfileMenu'

const CustomMenuButton = styled(MenuButton)`
  padding: 0;
  background-color: transparent!important;
  border: none
`

export const ProfileMenu = (): JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const { loggedInUser, play, setPlay } = usePageContext()
  const { loggingOut, handleLogout }: UseProfileMenu = useProfileMenu()

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <Dropdown>
      <CustomMenuButton>
        <ProfileIcon user={loggedInUser} />
      </CustomMenuButton>
      <Menu>
        {pathname === '/' && (
          <MenuItem>
            <Button
              variant='plain'
              color='neutral'
              onClick={() => setPlay(!play)}
            >
              {play ? 'Close' : 'Play'} the game
            </Button>
          </MenuItem>
        )}
        {!play && (<MenuItem>
          <Button
            variant='plain'
            color='neutral'
            onClick={handleProfileClick}
          >
            Profile
          </Button>
        </MenuItem>)}
        <MenuItem>
          <Button
            loading={loggingOut}
            variant='plain'
            color='neutral'
            onClick={handleLogout}
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </Dropdown>
  )
}