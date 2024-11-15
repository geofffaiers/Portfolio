'use client'
import { zxcvbnAsync, ZxcvbnResult } from "@zxcvbn-ts/core"
import { useCallback, useEffect, useState } from "react"

interface Props {
  password: string
  setPasswordScore: (score: number) => void
}

export const PasswordStrength = ({ password, setPasswordScore }: Props): JSX.Element => {
  const [passwordStrength, setPasswordStrength] = useState<ZxcvbnResult | null>(null)

  useEffect(() => {
    const checkPassword = async (): Promise<void> => {
      const passwordStrength: ZxcvbnResult = await zxcvbnAsync(password)
      setPasswordStrength(passwordStrength)
      setPasswordScore(passwordStrength.score)
    }
    checkPassword()
  }, [password, setPasswordScore])

  const getColor = useCallback((): string => {
    switch (passwordStrength?.score ?? 0) {
      case 0:
        return 'transparent'
      case 1:
      case 2:
        return 'red'
      case 3:
        return 'amber'
      case 4:
        return 'green'
      default:
        return 'transparent'
    }
  }, [passwordStrength])

  const getWidth = useCallback((): string => {
    const score: number = passwordStrength?.score ?? 0
    return `${(score / 4) * 100}%`
  }, [passwordStrength])

  return (
    <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
      <div
        style={{
          width: getWidth(),
          height: '100%',
          backgroundColor: getColor(),
          transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out'
        }}
      />
    </div>
  )
}