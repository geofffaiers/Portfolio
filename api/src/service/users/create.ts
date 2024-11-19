import bcrypt from 'bcrypt'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { addToPreviousPasswords } from './methods'
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core'

export const create = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const user: User = plainToInstance(User, req.body, { excludeExtraneousValues: true })
    user.id = 0
    const uniqueUsername = await isUsernameUnique(user.username)
    const uniqueEmail = await isEmailUnique(user.email)
    if (uniqueUsername === false && uniqueEmail === false) {
      return {
        success: false,
        message: 'Username and email are already taken'
      }
    }
    if (uniqueUsername === false) {
      return {
        success: false,
        message: 'Username is already taken'
      }
    }
    if (uniqueEmail === false) {
      return {
        success: false,
        message: 'Email is already taken'
      }
    }
    const passwordStrength: ZxcvbnResult = zxcvbn(user.password)
    if (passwordStrength.score < 3) {
      let message: string = passwordStrength.feedback.warning ?? ''
      if (passwordStrength.feedback.suggestions.length > 0) {
        message += ` ${passwordStrength.feedback.suggestions.join(' ')}`
      }
      return {
        success: false,
        message
      }
    }
    user.password = await bcrypt.hash(user.password, 10)
    await validateOrReject(user)
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users
        (username, password, email, first_name, last_name)
      VALUES
        (?, ?, ?, ?, ?)`,
      [user.username, user.password, user.email, user.firstName, user.lastName]
    )
    user.id = result.insertId
    await addToPreviousPasswords(user)
    await addInitialMessage(user)
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}

const isUsernameUnique = async (username: string): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE username = ?', [username])
  return rows.length === 0
}

const isEmailUnique = async (email: string): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email])
  return rows.length === 0
}

const addInitialMessage = async (user: User): Promise<void> => {
  await pool.query<ResultSetHeader>(
    `INSERT INTO messages
      (sender_id, receiver_id, content)
    VALUES
      (?, ?, ?)`,
    [1, user.id, `Welcome to my portfolio, ${user.username}. Please feel free to message me anytime!`]
  )
}
