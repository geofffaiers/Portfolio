import {  Box } from '@mui/joy'
import { User } from '../../models'
import { Login } from './Login'
import { Logout } from './Logout'
import { Register } from './Register'

interface Props {
  children: React.ReactNode
  readingFromLocalStorage: boolean
  loggedInUser: User | null
  setLoggedInUser: (user: User | null) => void
}

export const Auth = ({ children, readingFromLocalStorage, loggedInUser, setLoggedInUser }: Props): JSX.Element => {

  return (
    <>
      {loggedInUser == null && <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', position: 'fixed', top: 20, right: 20, zIndex: 3 }}>
        <Register readingFromLocalStorage={readingFromLocalStorage} setLoggedInUser={setLoggedInUser}/>
        <Login readingFromLocalStorage={readingFromLocalStorage} setLoggedInUser={setLoggedInUser} />
      </Box>}
      {loggedInUser != null && <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', position: 'fixed', top: 20, right: 20, zIndex: 3 }}>
        <Logout setLoggedInUser={setLoggedInUser} />
      </Box>}
      {children}
    </>
  )
}
