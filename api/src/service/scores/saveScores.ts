import { Request } from 'express'
import { DefaultResponse, Score, SaveScores } from '../../models'
import { getGlobalScores, getThisScore, getUserScores, saveScore } from './methods'
import { handleError } from '../../helpers'

export const saveScores = async (req: Request): Promise<DefaultResponse<SaveScores>> => {
  try {
    if (req.userId == null) {
      return {
        code: 400,
        success: false,
        message: 'User not found'
      }
    }
    if (req.body.score == null || typeof req.body.score !== 'number') {
      return {
        code: 400,
        success: false,
        message: 'Score is required as a number'
      }
    }
    const insertId: number = await saveScore(req.userId, req.body.score)
    const globalScores: Score[] = await getGlobalScores()
    const userScores: Score[] = await getUserScores(req.userId)
    const thisScore: Score = await getThisScore(insertId)
    return {
      code: 200,
      success: true,
      data: {
        globalScores,
        userScores,
        thisScore
      }
    }
  } catch (err: unknown) {
    return handleError<SaveScores>(err)
  }
}
