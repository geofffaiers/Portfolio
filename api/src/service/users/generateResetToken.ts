import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool, sendResetPasswordEmail } from '../../helpers'
import { DefaultResponse, User } from '../../models'

export const generateResetToken = async (req: Request): Promise<DefaultResponse> => {
  try {
    const { email } = req.body
    if (email == null) {
      return {
        success: false,
        message: 'Email is required'
      }
    }
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true })
    await validateOrReject(user)
    user.resetToken = newResetToken()
    user.resetTokenExpires = new Date(Date.now() + (5 * 1000 * 60))

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [user.resetToken, user.resetTokenExpires, user.id]
    )
    await sendResetPasswordEmail(user)
    user.password = ''
    return {
      success: true
    }
  } catch (err: any) {
    throw new Error(err)
  }
}

const newResetToken = (): string => {
  const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token: string = ''
  for (let i = 0; i < 16; i++) {
    const randomIndex: number = Math.floor(Math.random() * chars.length)
    token += chars[randomIndex]
  }
  return token
}
