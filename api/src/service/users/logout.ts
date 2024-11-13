import { CookieOptions, Request, Response } from 'express'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'

export const logout = async (req: Request, res: Response): Promise<DefaultResponse<undefined>> => {
  try {
    const userId: number | undefined = req.userId
    if (userId == null) {
      return {
        success: false,
        message: 'Not logged in'
      }
    }
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
    res.clearCookie('token', cookieOptions)
    res.clearCookie('refreshToken', cookieOptions)
    return {
      success: true
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
