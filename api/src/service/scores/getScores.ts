import { Request } from 'express'
import { DefaultResponse, Score } from '../../models'
import { getGlobalScores, getUserScores } from './methods'

interface Response {
  globalScores: Score[]
}

export const getScores = async (req: Request): Promise<DefaultResponse<Response>> => {
  try {
    const globalScores: Score[] = await getGlobalScores()
    return {
      success: true,
      data: {
        globalScores
      }
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
