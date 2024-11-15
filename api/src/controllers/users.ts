import { NextFunction, Request, Response } from 'express'
import { create, generateResetToken, getUserForResetToken, login, logout, refreshToken, resetPassword, update } from '../service/users'

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

  async getUserForResetToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await getUserForResetToken(req))
    } catch (err: any) {
      next(err)
    }
  }

  async login (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await login(req, res))
    } catch (err: any) {
      next(err)
    }
  }

  async logout (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await logout(req, res))
    } catch (err: any) {
      next(err)
    }
  }

  async refreshToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await refreshToken(req, res))
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
