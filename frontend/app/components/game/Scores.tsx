import { Score } from "@/app/models"
import { Typography } from "@mui/joy"
import { useState } from "react"

interface Props {
  title: string
  scores: Score[]
  thisScore: Score | undefined
  displayThisScore?: boolean | undefined
  loading: boolean
  error: string | null
}

export const Scores = ({ title, scores, thisScore, displayThisScore, loading, error }: Props): JSX.Element => {
  const [scoreDisplayed, setScoreDisplayed] = useState<boolean>(false)

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error}</div>
  }
  if (scores.length === 0) {
    return <div>No scores found</div>
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
            {scores.map((score, index) => {
              const isThisScore = thisScore && score.id === thisScore.id
              if (isThisScore && displayThisScore) {
                setScoreDisplayed(true)
              }
              return (
                <tr key={index} style={{ borderBlock: isThisScore ? '1px solid var(--foreground)' : 'none' }}>
                  <td>{score.ranking}</td>
                  <td>{score.name}</td>
                  <td style={{ textAlign: 'right' }}>{score.score}</td>
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
