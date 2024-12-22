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

  async logout (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await logout(req, res)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async refreshToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await refreshToken(req, res)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async resetPassword (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await resetPassword(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse<User> = await update(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async del (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await del(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async validateEmail (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await validateEmail(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async resendVerification (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: DefaultResponse = await resendVerification(req)
      res.status(response.code).json(response)
    } catch (err: any) {
      next(err)
    }
  }
}
