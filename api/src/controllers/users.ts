import { NextFunction, Request, Response } from 'express'
import { create, del, generateResetToken, getUserForResetToken, getUserForValidateToken, login, logout, refreshToken, resendVerification, resetPassword, update, validateEmail } from '../service/users'
import { DefaultResponse, User } from '../models'

export default class UsersController {
  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse<User> = await create(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async generateResetToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await generateResetToken(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async getUserForResetToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse<User> = await getUserForResetToken(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async getUserForValidateToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse<User> = await getUserForValidateToken(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async login (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse<User> = await login(req, res)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  // TODO: Tidying handlers
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

  async del (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await del(req))
    } catch (err: any) {
      next(err)
    }
  }

  async validateEmail (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await validateEmail(req))
    } catch (err: any) {
      next(err)
    }
  }

  async resendVerification (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await resendVerification(req))
    } catch (err: any) {
      next(err)
    }
  }
}
