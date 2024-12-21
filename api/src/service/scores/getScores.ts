import { Request } from 'express'
import { DefaultResponse, Score, GetScores } from '../../models'
import { getGlobalScores } from './methods'
import { handleError } from '../../helpers'

export const getScores = async (req: Request): Promise<DefaultResponse<GetScores>> => {
  try {
    const globalScores: Score[] = await getGlobalScores()
    return {
      code: 200,
      success: true,
      data: {
        globalScores
      }
    }
  } catch (err: unknown) {
    return handleError<GetScores>(err)
  }
}
