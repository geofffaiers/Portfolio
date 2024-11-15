import { DefaultResponse, User } from "@/app/models"
import { Button } from "@mui/joy"
import { useEffect, useRef, useState } from "react"

interface Props {
  setLoggedInUser: (user: User | null) => void
}

interface State {
  loggingOut: boolean
  error: string
}

export const Logout = ({ setLoggedInUser }: Props): JSX.Element => {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [state, setState] = useState<State>({
    loggingOut: false,
    error: ''
  })
  
  const handleLogout = async (): Promise<void> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      setState(s => ({
        ...s,
        loggingOut: true
      }))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
        signal
      })
      if (!response.ok) {
        setState(s => ({
          ...s,
          error: 'Logout failed',
          loggingOut: false
        }))
      }
      const json: DefaultResponse = await response.json()
      if (json.success) {
        setLoggedInUser(null)
      }
      setState(s => ({
        ...s,
        error: json.message ?? '',
        loggingOut: false
      }))
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <Button
      loading={state.loggingOut}
      variant='solid'
      color='neutral'
      onClick={handleLogout}
    >
      Logout
    </Button>
  )
}