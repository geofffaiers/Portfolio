import { Request } from 'express'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, MessageType, UpdatedProfile, User } from '../../models'
import { sendMessageToClient } from '../sockets/methods'
import { getUser } from './methods'

export const validateEmail = async (req: Request): Promise<DefaultResponse> => {
  try {
    const { userId, validateToken }: { userId: number; validateToken: string } = req.body
    if (userId == null || validateToken == null) {
      return {
        code: 400,
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
        code: 400,
        success: false,
        message: 'Invalid validate token'
      }
    }
    await pool.query(
      'UPDATE users SET verified_email = true, validate_token = NULL, validate_token_expires = NULL WHERE id = ?',
      [userId]
    )
    const user: User = await getUser(userId)
    user.password = ''
    const response: UpdatedProfile = {
      type: MessageType.UPDATED_PROFILE,
      user
    }
    sendMessageToClient(response, user.id)
    return {
      code: 200,
      success: true
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
