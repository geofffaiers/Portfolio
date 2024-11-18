import { NextFunction, Request, Response } from 'express'
import { getChatHeaders, getMessagesForPage } from '../service/messaging'

export default class MessagingController {
  async getChatHeaders (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await getChatHeaders(req))
    } catch (err: any) {
      next(err)
    }
  }

  async getMessagesForPage (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await getMessagesForPage(req))
    } catch (err: any) {
      next(err)
    }
  }
}
