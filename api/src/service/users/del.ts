import { Request } from 'express'
import { pool } from '../../helpers/db'
import { DefaultResponse, DeleteProfile, MessageType } from '../../models'
import { sendMessageToClient } from '../sockets/methods'

export const del = async (req: Request): Promise<DefaultResponse<undefined>> => {
  const connection = await pool.getConnection()
  try {
    const userId = req.userId
    if (userId == null) {
      return {
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
      success: true
    }
  } catch (err: any) {
    await connection.rollback()
    throw new Error(err)
  } finally {
    connection.release()
  }
}
