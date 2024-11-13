import bcrypt from 'bcrypt'
import { CookieOptions, Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { generateJwt } from './methods'

const delay = async (ms: number): Promise<void> => await new Promise(resolve => setTimeout(resolve, ms))

export const login = async (req: Request, res: Response): Promise<DefaultResponse<User>> => {
  try {
    await delay(1000)
    const { username, password } = req.body
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true })
    await validateOrReject(user)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid password'
      }
    }
    user.password = ''
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
    res.cookie('token', await generateJwt(user.id, '2h'), cookieOptions)
    res.cookie('refreshToken', await generateJwt(user.id, '7d'), cookieOptions)
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
