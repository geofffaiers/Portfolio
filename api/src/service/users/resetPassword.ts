import bcrypt from 'bcrypt'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { addToPreviousPasswords } from './methods'

export const resetPassword = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const { userId, newPassword, resetToken } = req.body
    if (!userId || !newPassword || !resetToken) {
      return {
        success: false,
        message: 'Missing required fields'
      }
    }
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      `SELECT * FROM users WHERE id = ? AND reset_token = ? AND reset_token_expires > NOW()`,
      [userId, resetToken]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'Invalid or expired reset token'
      }
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true })
    await validateOrReject(user)
    user.password = await bcrypt.hash(newPassword, 10)
    await pool.query(
      `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
      [user.password, userId]
    )
    await addToPreviousPasswords(user)
    user.password = ''
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}