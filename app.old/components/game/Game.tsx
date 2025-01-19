"use client"

import React, { JSX, useRef } from "react"
import styles from "./Game.module.css"
import { DEFAULT_TIME, useGame } from "./hooks/useGame"
import { ScoreDisplay } from "./ScoreDisplay"

export const Game = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { counter, score, timeLeft, animateScore, newGame } = useGame({ canvasRef })

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas} ref={canvasRef}/>
      <div className={styles.content}>
        <div className={styles.pointerReset}>
          <ScoreDisplay counter={counter} score={score} animateScore={animateScore} timeLeft={timeLeft} newGame={newGame} />
        </div>
      </div>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{
            width: `${(timeLeft / DEFAULT_TIME) * 100}%`,
            backgroundColor: timeLeft < (DEFAULT_TIME * 0.33) ? "red" : timeLeft < (DEFAULT_TIME * 0.66) ? "orange" : "green"
          }}
        />
      </div>
    </div>
  )
}