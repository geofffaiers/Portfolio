import { Score } from "../Score"

export interface SaveScores {
  globalScores: Score[]
  userScores: Score[]
  thisScore: Score
}
