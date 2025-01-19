"use client"

import { zxcvbnAsync, ZxcvbnResult } from "@zxcvbn-ts/core"
import React from "react"

type Props = {
  password: string
  setPasswordScore: (score: number) => void
}

function PasswordStrength({ password, setPasswordScore }: Props) {
  const [passwordStrength, setPasswordStrength] = React.useState<ZxcvbnResult | null>(null)

  React.useEffect(() => {
    const checkPassword = async (): Promise<void> => {
      const passwordStrength: ZxcvbnResult = await zxcvbnAsync(password)
      setPasswordStrength(passwordStrength)
      setPasswordScore(passwordStrength.score)
    }
    checkPassword()
  }, [password, setPasswordScore])

  const getColor = React.useCallback((): string => {
    switch (passwordStrength?.score ?? 0) {
      case 0:
        return "transparent"
      case 1:
      case 2:
        return "bg-red-700"
      case 3:
        return "bg-orange-600"
      case 4:
        return "bg-lime-600"
      default:
        return "transparent"
    }
  }, [passwordStrength])

  const getWidth = React.useCallback((): string => {
    const score: number = passwordStrength?.score ?? 0
    return `${(score / 4) * 100}%`
  }, [passwordStrength])

  return (
    <div
      className="w-full h-2 bg-gray-300 rounded overflow-hidden"
    >
      <div
        className={`h-full transition-all duration-200 ${getColor()}`}
        style={{ width: getWidth() }}
      />
    </div>
  )
}
PasswordStrength.displayName = "PasswordStrength"

export { PasswordStrength }
