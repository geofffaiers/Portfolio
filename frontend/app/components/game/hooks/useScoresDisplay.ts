import { useCallback, useRef, useState } from 'react'
import { getApiUrl } from '@/app/helpers'
import { DefaultResponse, Score } from '@/app/models'

interface Props {
  counter: number
}

export const useScoresDisplay = ({ counter }: Props) => {
  const [globalScores, setGlobalScores] = useState<Score[] | undefined>(undefined)
  const [userScores, setUserScores] = useState<Score[] | undefined>(undefined)
  const [thisScore, setThisScore] = useState<Score | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastSavedCounterRef = useRef<number>(-1)
  const lastRequestedCounterRef = useRef<number>(-1)

  const saveScore = useCallback(async (score: number) => {
    if (counter === lastSavedCounterRef.current) return
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    try {
      const { signal } = abortControllerRef.current = new AbortController()
      setLoading(true)
      const response = await fetch(`${getApiUrl()}/scores`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score }),
        signal
      })
      abortControllerRef.current = null
      setLoading(false)
      if (!response.ok) {
        setError('Failed to save score')
        return
      }
      const json: DefaultResponse<{
        globalScores: Score[]
        userScores: Score[]
        thisScore: Score
      }> = await response.json()
      if (json.success && json.data != null) {
        lastSavedCounterRef.current = counter
        lastRequestedCounterRef.current = counter
        setGlobalScores(json.data.globalScores)
        setUserScores(json.data.userScores)
        setThisScore(json.data.thisScore)
      } else {
        setError(json.message ?? 'Failed to save score')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
        setError(error.message)
      }
    }
  }, [counter])

  const getScores = useCallback(async () => {
    if (counter === lastRequestedCounterRef.current) return
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    try {
      const { signal } = abortControllerRef.current = new AbortController()
      setLoading(true)
      const response = await fetch(`${getApiUrl()}/scores`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        signal
      })
      abortControllerRef.current = null
      setLoading(false)
      if (!response.ok) {
        setError('Failed to get scores')
        return
      }
      const json: DefaultResponse<{
        globalScores: Score[]
      }> = await response.json()
      if (json.success && json.data != null) {
        lastRequestedCounterRef.current = counter
        setGlobalScores(json.data.globalScores)
      } else {
        setError(json.message ?? 'Failed to get scores')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
        setError(error.message)
      }
    }
  }, [counter])

  const clearScores = useCallback(() => {
    setThisScore(undefined)
    setGlobalScores(undefined)
    setUserScores(undefined)
  }, [])

  return {
    globalScores,
    userScores,
    thisScore,
    loading,
    error,
    currentGameSaved: lastSavedCounterRef.current === counter,
    currentGameRequested: lastRequestedCounterRef.current === counter,
    saveScore,
    getScores,
    clearScores
  }
}
