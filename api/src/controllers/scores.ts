import { NextFunction, Request, Response } from 'express'
import { getScores, saveScores } from '../service/scores'

export default class ScoresController {
  async saveScores (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await saveScores(req))
    } catch (err: any) {
      next(err)
    }
  }

  async getScores (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await getScores(req))
    } catch (err: any) {
      next(err)
    }
  }
}
