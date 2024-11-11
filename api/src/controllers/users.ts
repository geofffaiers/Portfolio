import { NextFunction, Request, Response } from 'express'
import { create, login } from '../service/users'

export default class UsersController {
  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await create(req))
    } catch (err: any) {
      next(err)
    }
  }

  async login (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await login(req))
    } catch (err: any) {
      next(err)
    }
  }
}
