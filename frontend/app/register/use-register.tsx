"use client"

import { useAuthContext } from "@/components/providers/auth-provider"
import { useConfigContext } from "@/components/providers/config-provider"
import { useError } from "@/hooks/use-error"
import { useLogin } from "@/hooks/use-login"
import { DefaultResponse, User } from "@/models"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

type UseRegister = {
  loading: boolean
  passwordScore: number
  handleRegister: (data: Data) => Promise<void>
  setPasswordScore: (value: number) => void
}

type Data = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function useRegister(): UseRegister {
  const { user, setUser } = useAuthContext()
  const { displayError } = useError()
  const { handleLogin } = useLogin()
  const { config } = useConfigContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [passwordScore, setPasswordScore] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  const handleRegister = useCallback(async (data: Data) => {
    setLoading(true)
    try {
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current
      const response = await fetch(`${config.apiUrl}/users/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          username:
          data.username,
          password: data.password
        }),
        signal
      })
      if (!response.ok) {
        displayError('Network response was not ok')
        return
      }
      const json: DefaultResponse<User> = await response.json()
      if (json.success && json.data != null) {
        await handleLogin(data.username, data.password)
      } else {
        displayError(`Failed to update user: ${json.message}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        displayError(`Failed to update user: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }, [setUser, displayError])
  
  useEffect(() => {
    if (user != null) {
      router.push("/account")
    }
  }, [user, router])

  return {
    loading,
    passwordScore,
    handleRegister,
    setPasswordScore,
  }
}
