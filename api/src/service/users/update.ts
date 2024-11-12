import bcrypt from 'bcrypt'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { addToPreviousPasswords } from './methods'
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core'

export const update = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const user: User = plainToInstance(User, req.body, { excludeExtraneousValues: true })
    await validateOrReject(user)
    if (await isPasswordChanged(user)) {
      if (await isPasswordNew(user)) {
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
        await updateAll(user)
      } else {
        return {
          success: false,
          message: 'Password has been used in the last 3 months'
        }
      }
    } else {
      await updateExceptPassword(user)
    }
    user.password = ''
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}

const isPasswordChanged = async (user: User): Promise<boolean> => {
  const [result] = await pool.query<User[] & RowDataPacket[]>(
    `SELECT password
    FROM users
    WHERE id = ?`,
    [user.id]
  )
  if (result.length === 0) {
    throw new Error('User not found')
  }
  return !await bcrypt.compare(user.password, result[0].password)
}

const isPasswordNew = async (user: User): Promise<boolean> => {
  const [result] = await pool.query<{ password: string } & RowDataPacket[]>(
    `SELECT password
    FROM previous_passwords
    WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    LIMIT 10`,
    [user.id]
  )
  return result.every((row) => !bcrypt.compareSync(user.password, row.password))
}

const updateAll = async (user: User): Promise<void> => {
  await pool.query(
    `UPDATE users
    SET email = ?, first_name = ?, last_name = ?, profile_picture = ?, password = ?
    WHERE id = ?`,
    [user.email, user.firstName, user.lastName, user.profilePicture, user.password, user.id]
  )
  await addToPreviousPasswords(user)
}

const updateExceptPassword = async (user: User): Promise<void> => {
  await pool.query(
    `UPDATE users
    SET email = ?, first_name = ?, last_name = ?, profile_picture = ?
    WHERE id = ?`,
    [user.email, user.firstName, user.lastName, user.profilePicture, user.id]
  )
}
