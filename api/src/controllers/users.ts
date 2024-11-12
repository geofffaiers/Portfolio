import { NextFunction, Request, Response } from 'express'
import { create, generateResetToken, login, refreshToken, resetPassword, update } from '../service/users'

export default class UsersController {
  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await create(req))
    } catch (err: any) {
      next(err)
    }
  }

  async generateResetToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await generateResetToken(req))
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

  async refreshToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await refreshToken(req))
    } catch (err: any) {
      next(err)
    }
  }

  async resetPassword (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await resetPassword(req))
    } catch (err: any) {
      next(err)
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await update(req))
    } catch (err: any) {
      next(err)
    }
  }
}
