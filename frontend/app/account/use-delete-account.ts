"use client"

import { useAuthContext } from "@/components/providers/auth-provider"
import { useConfigContext } from "@/components/providers/config-provider"
import { useError } from "@/hooks/use-error"
import { DefaultResponse } from "@/models"
import { useState, useCallback, useRef } from "react"

type UseDeleteAccount = {
  loading: boolean
  typedConfirmation: string
  setTypedConfirmation: (value: string) => void
  handleDeleteAccount: () => Promise<void>
}

export function useDeleteAccount(): UseDeleteAccount {
  const { setUser } = useAuthContext()
  const { config } = useConfigContext()
  const { displayError } = useError()
  const [loading, setLoading] = useState<boolean>(false)
  const [typedConfirmation, setTypedConfirmation] = useState<string>("")
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleDeleteAccount = useCallback(async () => {
    setLoading(true)
    try {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      const response = await fetch(`${config.apiUrl}/users/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal
      })
      const json: DefaultResponse = await response.json()
      if (json.success) {
        setUser(null)
      } else {
        displayError(`Failed to delete account: ${json.message}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        displayError(error.message)
      } else {
        displayError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }, [displayError, config])

  return {
    loading,
    typedConfirmation,
    setTypedConfirmation,
    handleDeleteAccount
  }
}
