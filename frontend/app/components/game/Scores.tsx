import { Score } from "@/app/models"
import { CircularProgress, Typography } from "@mui/joy"
import { useMemo, useState } from "react"

interface Props {
  title: string
  scores: Score[]
  thisScore: Score | undefined
  displayThisScore?: boolean | undefined
  loading: boolean
  error: string | null
}

interface HighlightedScores extends Score {
  isThisScore: boolean
}

export const Scores = ({ title, scores, thisScore, displayThisScore, loading, error }: Props): JSX.Element => {
  const [scoreDisplayed, setScoreDisplayed] = useState<boolean>(false)
  const highlightedScores: HighlightedScores[] = useMemo(() => {
    return scores.map((score): HighlightedScores => {
      const isThisScore: boolean = thisScore != null && score.id === thisScore.id
      if (isThisScore && displayThisScore) {
        setScoreDisplayed(true)
      }
      return {
        ...score,
        isThisScore
      }
    })
  }, [scores, displayThisScore, thisScore])

  if (loading) {
    return <CircularProgress />
  }
  if (error) {
    return <Typography level='h3' sx={{ color: 'var(--foreground)', textAlign: 'center', marginBottom: '1rem' }}>{error}</Typography>
  }
  if (scores.length === 0) {
    return <Typography level='h2' sx={{ color: 'var(--foreground)', textAlign: 'center', marginBottom: '1rem' }}>No high scores are saved!</Typography>
  }

  return (
    <>
      <div style={{ marginTop: '1rem' }}>
        <Typography level='h3' sx={{ color: 'var(--foreground)', textAlign: 'center' }}>{title}</Typography>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {highlightedScores.map((row, index) => {
              const { ranking, name, score, isThisScore } = row
              return (
                <tr key={index} style={{ borderBlock: isThisScore ? '1px solid var(--foreground)' : 'none' }}>
                  <td>{ranking}</td>
                  <td>{name}</td>
                  <td style={{ textAlign: 'right' }}>{score}</td>
                </tr>
              )
            })}
            {displayThisScore && !scoreDisplayed && (
              <tr style={{ borderBlock: '1px solid var(--foreground)' }}>
                <td>{thisScore?.ranking}</td>
                <td>{thisScore?.name}</td>
                <td style={{ textAlign: 'right' }}>{thisScore?.score}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
