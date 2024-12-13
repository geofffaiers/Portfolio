import { getApiUrl } from "@/app/helpers"
import { DefaultResponse, User } from "@/app/models"
import { Button, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import { ProfileIcon } from "../ProfileIcon"
import { usePageContext } from "@/app/context"
import styled from "@emotion/styled"
import { useRouter, usePathname } from "next/navigation"

const CustomMenuButton = styled(MenuButton)`
  padding: 0;
  background-color: transparent!important;
  border: none
`

interface Props {
  setLoggedInUser: (user: User | null) => void
  setError: (error: string) => void
}

interface State {
  loggingOut: boolean
}

export const ProfileMenu = ({ setLoggedInUser, setError }: Props): JSX.Element => {
  const router = useRouter()
  const { loggedInUser, play, setPlay } = usePageContext()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [state, setState] = useState<State>({
    loggingOut: false
  })
  const pathname = usePathname()
  
  const handleLogout = async (): Promise<void> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      setState(s => ({
        ...s,
        loggingOut: true
      }))
      const response = await fetch(`${getApiUrl()}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        signal
      })
      if (!response.ok) {
        setError('Logout failed')
        setState(s => ({
          ...s,
          loggingOut: false
        }))
      }
      const json: DefaultResponse = await response.json()
      if (json.success) {
        setLoggedInUser(null)
      }
      setError(json.message ?? '')
      setState(s => ({
        ...s,
        loggingOut: false
      }))
    } catch (error: unknown) {
      setError(`${error}`)
      setState(s => ({
        ...s,
        loggingOut: false
      }))
    }
  }
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

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
            loading={state.loggingOut}
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