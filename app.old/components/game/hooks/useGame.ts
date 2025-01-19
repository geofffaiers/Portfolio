import { useCallback, useEffect, useRef, useState } from "react"
import { Bubble } from "../Bubble"

interface Props {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

interface Dimensions {
  width: number
  height: number
}

export const DEFAULT_TIME: number = 15

export const useGame = ({ canvasRef }: Props) => {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
  const [density, setDensity] = useState<number>(0)
  const bubblesRef = useRef<Bubble[]>([])
  const [counter, setCounter] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [animateScore, setAnimateScore] = useState<boolean>(false)
  const [playing, setPlaying] = useState<boolean>(false)
  const timeLeftRef = useRef<number>(DEFAULT_TIME)

  const createBubble = useCallback((): void => {
    const size = Math.random() * 20 + 10
    const topPosition = Math.random() * dimensions.height
    const leftPosition = Math.random() * dimensions.width
    const topMovement = (Math.random() - 0.5) * 2
    const leftMovement = (Math.random() - 0.5) * 2
    bubblesRef.current.push(new Bubble(topPosition, leftPosition, topMovement, leftMovement, size))
  }, [dimensions])

  const createBubbles = useCallback((): void => {
    for (let i = 0; i < density; i++) {
      createBubble()
    }
  }, [createBubble, density])

  const newGame = useCallback(() => {
    setScore(0)
    timeLeftRef.current = DEFAULT_TIME
    bubblesRef.current = []
    createBubbles()
  }, [createBubbles])

  const handleMouseMove = useCallback((event: MouseEvent): void => {
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
        createBubble()
        break
      }
    }
  }, [playing, setPlaying, setScore, setAnimateScore, createBubble])

  const handleTouchMove = useCallback((event: TouchEvent): void => {
    const touch = event.touches[0]
    if (touch) {
      handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      } as MouseEvent)
    }
  }, [handleMouseMove])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext("2d")
    if (ctx == null) return

    let animationFrameId: number

    const resizeCanvas = (): void => {
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width
      canvas.height = height
      setDimensions({ width, height })
      setDensity(Math.floor((width * height) / 50000))
      newGame()
    }

    const animate = (currentTime: number): void => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      bubblesRef.current = bubblesRef.current.filter(bubble => {
        bubble.update(dimensions.width, dimensions.height)
        bubble.draw(ctx, currentTime)
        return !bubble.popped || (bubble.popStartTime !== null && currentTime - bubble.popStartTime < 300)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    if (dimensions.width === 0 || dimensions.height === 0) {
      resizeCanvas()
    }
    if (bubblesRef.current.length === 0) {
      createBubbles()
    }
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, canvasRef, createBubbles, newGame])

  useEffect(() => {
    if (!playing) {
      setPlaying(false)
      newGame()
      return
    }

    const timerId = setInterval(() => {
      if (timeLeftRef.current <= 1) {
        setPlaying(false)
        bubblesRef.current = []
        clearInterval(timerId)
      }
      timeLeftRef.current -= 1
    }, 1000)

    return () => {
      clearInterval(timerId)
      setPlaying(false)
      newGame()
    }
  }, [playing, newGame])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove, newGame])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bubblesRef.current.length < density && (playing || timeLeftRef.current === DEFAULT_TIME)) {
        createBubble()
      }
    }, Math.min(9000 / density, 1000))

    return () => {
      clearInterval(intervalId)
    }
  }, [playing, density, createBubble])

  return {
    counter,
    score,
    timeLeft: timeLeftRef.current,
    animateScore,
    newGame
  }
}
