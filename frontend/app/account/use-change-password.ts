"use client"
import { useState, useCallback, useRef } from "react"
import { useError } from "@/hooks/use-error"
import { useConfigContext } from "@/components/providers/config-provider"
import { DefaultResponse, User } from "@/models"
import { useAuthContext } from "@/components/providers/auth-provider"

type UseChangePassword = {
  open: boolean
  setOpen: (value: boolean) => void
  loading: boolean
  handleChangePassword: (oldPassword: string, newPassword: string) => Promise<void>
  passwordScore: number
  setPasswordScore: (value: number) => void
}

export function useChangePassword(): UseChangePassword {
  const { user } = useAuthContext()
  const { config } = useConfigContext()
  const { displayError } = useError()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [passwordScore, setPasswordScore] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleChangePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!user) return
      const tempUser: User = {
        ...user,
        password: newPassword
      }
      setLoading(true)
      try {
        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current
        const response = await fetch(`${config.apiUrl}/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ ...tempUser, currentPassword: oldPassword }),
          signal
        })
        const json: DefaultResponse<User> = await response.json()
        if (json.success) {
          setOpen(false)
        } else {
          displayError(`Failed to change password: ${json.message}`)
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
    },
    [displayError, config, user]
  )

  return { open, setOpen, loading, handleChangePassword, passwordScore, setPasswordScore }
}
