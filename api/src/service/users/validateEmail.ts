import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'

export const validateEmail = async (req: Request): Promise<DefaultResponse<undefined>> => {
  try {
    const { userId, validateToken }: { userId: number; validateToken: string } = req.body
    if (userId == null || validateToken == null) {
      return {
        success: false,
        message: 'Missing required fields'
      }
    }
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? AND validate_token = ?',
      [userId, validateToken]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'Invalid validate token'
      }
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true })
    await validateOrReject(user)
    await pool.query(
      'UPDATE users SET validate_email = true, validate_token = NULL, validate_token_expires = NULL WHERE id = ?',
      [userId]
    )
    return {
      success: true
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
