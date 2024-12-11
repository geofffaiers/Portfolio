import { usePageContext } from '@/app/context'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Bubble } from '../Bubble'

interface Props {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

export const DEFAULT_TIME: number = 15

export const useGame = ({ canvasRef }: Props) => {
  const { play } = usePageContext()
  const bubblesRef = useRef<Bubble[]>([])
  const [counter, setCounter] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME)
  const [score, setScore] = useState<number>(0)
  const [animateScore, setAnimateScore] = useState<boolean>(false)
  const [playing, setPlaying] = useState<boolean>(false)

  const createBubble = useCallback((): void => {
    const canvas = canvasRef.current
    if (canvas == null) return
    const size = Math.random() * 20 + 10
    const topPosition = Math.random() * canvas.height
    const leftPosition = Math.random() * canvas.width
    const topMovement = (Math.random() - 0.5) * 2
    const leftMovement = (Math.random() - 0.5) * 2
    bubblesRef.current.push(new Bubble(topPosition, leftPosition, topMovement, leftMovement, size))
  }, [canvasRef])

  const createBubbles = useCallback((amount: number): void => {
    for (let i = 0; i < amount; i++) {
      createBubble()
    }
  }, [createBubble])

  const newGame = useCallback(() => {
    setScore(0)
    setTimeLeft(DEFAULT_TIME)
    bubblesRef.current = []
    createBubbles(10)
  }, [createBubbles])

  const handleMouseMove = useCallback((event: MouseEvent): void => {
    const canvas = canvasRef.current
    if (canvas == null) return
    const { clientX, clientY } = event
    for (let i = 0; i < bubblesRef.current.length; i++) {
      const bubble = bubblesRef.current[i]
      if (!bubble.popped && bubble.isCursorOver(clientX, clientY)) {
        bubble.pop()
        if (!playing) {
          setCounter(prevCounter => prevCounter + 1)
          setPlaying(true)
        }
        setScore(prevScore => prevScore + 1)
        setAnimateScore(true)
        setTimeout(() => setAnimateScore(false), 300)
        const size = Math.random() * 20 + 10
        const topPosition = Math.random() * canvas.height
        const leftPosition = Math.random() * canvas.width
        const topMovement = (Math.random() - 0.5) * 2
        const leftMovement = (Math.random() - 0.5) * 2
        bubblesRef.current.push(new Bubble(topPosition, leftPosition, topMovement, leftMovement, size))
        break
      }
    }
  }, [playing, setPlaying, setScore, setAnimateScore, canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    let animationFrameId: number

    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = (currentTime: number): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      bubblesRef.current = bubblesRef.current.filter(bubble => {
        bubble.update(canvas.width, canvas.height)
        bubble.draw(ctx, currentTime)
        return !bubble.popped || (bubble.popStartTime !== null && currentTime - bubble.popStartTime < 300)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    if (bubblesRef.current.length === 0) {
      createBubbles(10)
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [canvasRef, createBubbles])

  useEffect(() => {
    if (!playing) return

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setPlaying(false)
          bubblesRef.current = []
          clearInterval(timerId)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    if (!play) {
      clearInterval(timerId)
      setPlaying(false)
      newGame()
    }

    return () => clearInterval(timerId)
  }, [playing, play, newGame])

  useEffect(() => {
    if (play) {
      window.addEventListener('mousemove', handleMouseMove)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [play, handleMouseMove, newGame])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bubblesRef.current.length < 20 && (playing || timeLeft === DEFAULT_TIME)) {
        createBubble()
      }
    }, 250)

    return () => {
      clearInterval(intervalId)
    }
  }, [playing, timeLeft, createBubble])

  useEffect(() => {
    console.log('c', counter)
  }, [counter])

  return {
    counter,
    score,
    timeLeft,
    animateScore,
    newGame
  }
}
