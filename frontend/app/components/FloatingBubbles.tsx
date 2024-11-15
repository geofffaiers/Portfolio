'use client'
import React, { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
}

class Bubble {
  topPosition: number
  leftPosition: number
  leftMovement: number
  topMovement: number
  size: number

  constructor (topPos: number, leftPos: number, top: number, left: number, size: number) {
    this.topPosition = topPos
    this.leftPosition = leftPos
    this.leftMovement = left
    this.topMovement = top
    this.size = size
  }

  update (width: number, height: number): void {
    if (this.leftPosition < 0 || this.leftPosition > width) {
      this.leftMovement = -this.leftMovement
    }
    if (this.topPosition < 0 || this.topPosition > height) {
      this.topMovement = -this.topMovement
    }
    this.leftPosition += this.leftMovement
    this.topPosition += this.topMovement
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'RGBA(43, 156, 191, 0.25)'
    ctx.strokeStyle = 'RGBA(43, 156, 191, 1)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.leftPosition, this.topPosition, this.size, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }
}

export const FloatingBubbles = ({ children }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createBubbles = (amount: number): void => {
      const bubbles: Bubble[] = []
      for (let x = 0; x < amount; x++) {
        const topPos = Math.random() * canvas.height
        const leftPos = Math.random() * canvas.width
        const size = Math.random() * 35 + 5
        const left = Math.random() - 0.5
        const top = Math.random() - 0.5
        bubbles.push(new Bubble(topPos, leftPos, top, left, size))
      }
      bubblesRef.current = bubbles
    }

    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      bubblesRef.current.forEach(bubble => {
        bubble.update(canvas.width, canvas.height)
        bubble.draw(ctx)
      })
      requestAnimationFrame(animate)
    }

    resizeCanvas()
    createBubbles(Math.floor(Math.random() * (50 - 10) + 10))
    animate()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', zIndex: 1, width: '100vw', height: '100vh' }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}