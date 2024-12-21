import { Request } from 'express'
import { ResultSetHeader } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { getUser, newToken } from './methods'
import { handleError, sendValidateEmail } from '../../helpers'

export const resendVerification = async (req: Request): Promise<DefaultResponse> => {
  try {
    if (req.userId == null) {
      return {
        code: 400,
        success: false,
        message: 'Unauthorized'
      }
    }
    const user: User = await getUser(req.userId)
    user.validateToken = newToken()
    user.validateTokenExpires = new Date(Date.now() + (5 * 1000 * 60))
    await pool.query<ResultSetHeader>(
      `UPDATE users
      SET validate_token = ?, validate_token_expires = ?, verified_email = false
      WHERE id = ?`,
      [user.validateToken, user.validateTokenExpires, user.id]
    )
    await sendValidateEmail(user)
    return {
      code: 200,
      success: true
    }
  } catch (err: unknown) {
    return handleError(err)
  }
}
