import { Button, Typography } from '@mui/joy'
import styles from './Game.module.css'
import { useScoresDisplay } from './hooks/useScoresDisplay'
import { usePageContext } from '@/app/context'
import { useEffect } from 'react'
import { Scores } from './Scores'

interface Props {
  counter: number
  score: number
  animateScore: boolean
  timeLeft: number
  newGame: () => void
}

export const ScoreDisplay = ({ counter, score, animateScore, timeLeft, newGame }: Props): JSX.Element => {
  const { loggedInUser } = usePageContext()
  const { globalScores, userScores, thisScore, loading, error, currentGameSaved, currentGameRequested, saveScore, getScores, clearScores } = useScoresDisplay({ counter })

  useEffect(() => {
    if (timeLeft === 0 && score > 0) {
      if (loggedInUser && !currentGameSaved) {
        saveScore(score)
      } else if (!currentGameRequested) {
        getScores()
      }
    } else if (timeLeft > 0 && globalScores != null) {
      clearScores()
    }
  }, [globalScores, score, loggedInUser, timeLeft, clearScores, currentGameRequested, currentGameSaved, getScores, saveScore])

  return (
    <>
      {score > 0 && timeLeft > 0 && (
        <div className={styles.scoreContainer}>
          <div className={`${styles.score} ${animateScore ? styles.animate : ''}`}>
            {score}
          </div>
        </div>
      )}
      {score === 0 && timeLeft > 0 && (
        <div className={styles.instructions}>
          Pop the bubbles!
        </div>
      )}
      {timeLeft === 0 && (
        <div className={styles.endGameContainer}>
          <Scores title='Top Scores' scores={globalScores ?? []} thisScore={thisScore} loading={loading} error={error}/>
          {loggedInUser && (<Scores title='Your Scores' scores={userScores ?? []} thisScore={thisScore} displayThisScore loading={loading} error={error}/>)}
          {!loggedInUser && !currentGameSaved && (
            <Typography level='body-lg' sx={{ color: 'var(--foreground)' }}>
              To save your score, please register!
            </Typography>
          )}
          <Button className={styles.resetButton} onClick={newGame} sx={{ marginTop: '1rem' }}>New Game</Button>
        </div>
      )}  
    </>
  )
}