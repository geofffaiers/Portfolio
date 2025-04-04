import { Score } from '../score';

export interface SaveScores {
  globalScores: Score[]
  userScores: Score[]
  thisScore: Score
}
