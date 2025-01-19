"use client"

import { useConfigContext } from "@/components/providers/config-provider"
import { useToast } from "@/hooks/use-toast"
import { DefaultResponse, ErrorCheck, User } from "@/models"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

type UseResetPassword = {
  error: string
  loading: boolean
  saving: boolean
  passwordScore: number
  setPasswordScore: (score: number) => void
  handleResetPassword: (newPassword: string) => Promise<void>
}

type Props = {
  resetToken: string
}

export function useResetPassword({ resetToken }: Props): UseResetPassword {
  const router = useRouter()
  const { toast } = useToast()
  const { config } = useConfigContext()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [passwordScore, setPasswordScore] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const getUserForResetToken = async (): Promise<ErrorCheck<User>> => {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      try {
        const response = await fetch(`${config.apiUrl}/users/get-user-for-reset-token?resetToken=${resetToken}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          signal
        })
        const json: DefaultResponse<User> = await response.json()
        if (json.success) {
          return [null, json.data]
        } else {
          return [json.message ?? "", null]
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          return [error.message, null]
        }
        console.error("Error:", error)
        return ["An unexpected error occurred", null]
      }
    }

    getUserForResetToken()
      .then(([error, User]: ErrorCheck<User>) => {
        setLoading(false)
        if (error != null) {
          setError(error)
          return
        }
        setUser(User)
      })

  }, [resetToken, config.apiUrl])

  const handleResetPassword = useCallback(async (newPassword: string) => {
    try {
      setSaving(true)
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      const response = await fetch(`${config.apiUrl}/users/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: user?.id, newPassword, resetToken }),
        signal
      })
      const json: DefaultResponse = await response.json()
      setSaving(false)
      if (json.success) {
        router.push("/login")
        toast({
          title: "Password reset",
          description: "Your password has been reset, please login.",
          variant: "default",
        })
      } else {
        setError(json.message ?? "An unexpected error occurred")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        console.error("Error:", error)
        setError("An unexpected error occurred")
      }
    }
  }, [user, router, toast])

  return {
    error,
    loading,
    saving,
    passwordScore,
    setPasswordScore,
    handleResetPassword,
  }
}
