import { useConfigContext } from "@/components/providers/config-provider"
import { useError } from "@/hooks/use-error"
import { useToast } from "@/hooks/use-toast"
import { DefaultResponse } from "@/models"
import { useCallback, useEffect, useRef, useState } from "react"

type UseForgotPassword = {
  loading: boolean
  open: boolean
  handleForgotPassword: (email: string) => Promise<void>
  setOpen: (open: boolean) => void
}

export function useForgotPassword(): UseForgotPassword {
  const { config } = useConfigContext()
  const { displayError } = useError()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const requestResetToken = useCallback(async (email: string): Promise<string> => {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    try {
      setLoading(true)
      const response = await fetch(`${config.apiUrl}/users/generate-reset-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
        signal
      })
      const json: DefaultResponse = await response.json()
      setLoading(false)
      return json.message ?? ""
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error.message
      }
      console.error("Error:", error)
      return `${error}`
    }
  }, [config.apiUrl])

  const handleForgotPassword = useCallback(async (email: string) => {
    const error: string = await requestResetToken(email)
    setOpen(false)
    if (error) {
      displayError(error)
    } else {
      toast({
        title: "Success",
        description: "We've emailed you a link to reset your password.",
        duration: 7000,
      })
    }
  }, [displayError, requestResetToken, toast])
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort("Component unmounted")
      }
    }
  }, [])

  return {
    loading,
    open,
    handleForgotPassword,
    setOpen,
  }
}
