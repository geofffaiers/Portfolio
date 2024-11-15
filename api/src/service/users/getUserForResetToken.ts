import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool, sendResetPasswordEmail } from '../../helpers'
import { DefaultResponse, User } from '../../models'
import { delay } from './methods'

export const getUserForResetToken = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const { resetToken } = req.body
    if (resetToken == null) {
      return {
        success: false,
        message: 'Reset token is required'
      }
    }
    await delay(1000)
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE reset_token = ?',
      [resetToken]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'Reset token is invalid'
      }
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true })
    await validateOrReject(user)
    if (user.resetTokenExpires != null && user.resetTokenExpires.getTime() < new Date().getTime()) {
      return {
        success: false,
        message: 'Reset token has expired'
      }
    }
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
