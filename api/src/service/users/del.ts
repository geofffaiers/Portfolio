import { Request } from 'express'
import { pool } from '../../helpers/db'
import { DefaultResponse, DeleteProfile, MessageType } from '../../models'
import { sendMessageToClient } from '../sockets/methods'
import { handleError } from '../../helpers'

export const del = async (req: Request): Promise<DefaultResponse> => {
  const connection = await pool.getConnection()
  try {
    const userId = req.userId
    if (userId == null) {
      return {
        code: 400,
        success: false,
        message: 'User not found'
      }
    }
    await connection.beginTransaction()
    await connection.query('DELETE FROM previous_passwords WHERE user_id = ?', [userId])
    await connection.query('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId])
    await connection.query('DELETE FROM scores WHERE user_id = ?', [userId])
    await connection.query('DELETE FROM users WHERE id = ?', [userId])
    await connection.commit()
    const response: DeleteProfile = {
      type: MessageType.DELETE_PROFILE
    }
    sendMessageToClient(response, userId)
    return {
      code: 200,
      success: true
    }
  } catch (err: any) {
    await connection.rollback()
    return handleError(err)
  } finally {
    connection.release()
  }
}
