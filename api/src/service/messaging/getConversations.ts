import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers'
import { DefaultResponse, User } from '../../models'

export const getConversations = async (req: Request): Promise<DefaultResponse<User[]>> => {
  try {
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      `SELECT DISTINCT u.*
      FROM users u
      JOIN messages m
        ON (u.id = m.receiver_id AND m.sender_id = ?)
        OR (u.id = m.sender_id AND m.receiver_id = ?)`,
      [req.userId, req.userId]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'User has no conversations'
      }
    }
    const users: User[] = await Promise.all(result.map(async (row: User) => {
      const u: User = plainToInstance(User, row, { excludeExtraneousValues: true })
      u.password = ''
      await validateOrReject(u)
      return u
    }))
    return {
      success: true,
      data: users
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
