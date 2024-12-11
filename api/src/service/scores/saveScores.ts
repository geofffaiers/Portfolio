import { Request } from 'express'
import { DefaultResponse, Score } from '../../models'
import { getGlobalScores, getThisScore, getUserScores, saveScore } from './methods'

interface Response {
  globalScores: Score[]
  userScores: Score[]
  thisScore: Score
}

export const saveScores = async (req: Request): Promise<DefaultResponse<Response>> => {
  try {
    if (req.userId == null) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    if (req.body.score == null || typeof req.body.score !== 'number') {
      return {
        success: false,
        message: 'Score is required as a number'
      }
    }
    const insertId: number = await saveScore(req.userId, req.body.score)
    const globalScores: Score[] = await getGlobalScores()
    const userScores: Score[] = await getUserScores(req.userId)
    const thisScore: Score = await getThisScore(insertId)
    return {
      success: true,
      data: {
        globalScores,
        userScores,
        thisScore
      }
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
