import { NextFunction, Request, Response } from 'express'
import { getConversations, getMessagesForPage } from '../service/messaging'

export default class MessagingController {
  async getConversations (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await getConversations(req))
    } catch (err: any) {
      next(err)
    }
  }

  async getMessagesForPage (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await getMessagesForPage(req))
    } catch (err: any) {
      next(err)
    }
  }
}
