import { DefaultResponse, User } from "@/app/models"
import { Button } from "@mui/joy"
import { useEffect, useRef, useState } from "react"

interface Props {
  setLoggedInUser: (user: User | null) => void
  setError: (error: string) => void
}

interface State {
  loggingOut: boolean
}

export const Logout = ({ setLoggedInUser, setError }: Props): JSX.Element => {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [state, setState] = useState<State>({
    loggingOut: false
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