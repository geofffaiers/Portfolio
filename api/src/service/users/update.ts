import bcrypt from 'bcrypt'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, MessageType, UpdatedProfile, User } from '../../models'
import { addToPreviousPasswords, getUser, newToken } from './methods'
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core'
import { sendMessageToClient } from '../sockets/methods'
import { sendValidateEmail } from '../../helpers'

export const update = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const user: User = plainToInstance(User, req.body, { excludeExtraneousValues: true })
    await validateOrReject(user)
    const existingUser: User = await getUser(user.id)
    if (user.password.length > 0) {
      if (await isCurrentPasswordCorrect(user.id, req.body.currentPassword) && await isPasswordNew(user)) {
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
        await updateAll(user, existingUser)
      } else {
        return {
          success: false,
          message: 'Password has been used in the last 3 months'
        }
      }
    } else {
      await updateExceptPassword(user, existingUser)
    }
    user.password = ''
    const response: UpdatedProfile = {
      type: MessageType.UPDATED_PROFILE,
      user
    }
    sendMessageToClient(response, user.id)
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}

const isCurrentPasswordCorrect = async (userId: number, currentPassword: string): Promise<boolean> => {
  const [result] = await pool.query<Partial<User> & RowDataPacket[]>(
    'SELECT password FROM users WHERE id = ?',
    [userId]
  )
  return bcrypt.compareSync(currentPassword, result[0].password)
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

const updateAll = async (user: User, existingUser: User): Promise<void> => {
  await pool.query(
    `UPDATE users
    SET email = ?, first_name = ?, last_name = ?, profile_picture = ?, password = ?
    WHERE id = ?`,
    [user.email, user.firstName, user.lastName, user.profilePicture, user.password, user.id]
  )
  await actionEmailChange(user, existingUser)
  await addToPreviousPasswords(user)
}

const updateExceptPassword = async (user: User, existingUser: User): Promise<void> => {
  await pool.query(
    `UPDATE users
    SET email = ?, first_name = ?, last_name = ?, profile_picture = ?
    WHERE id = ?`,
    [user.email, user.firstName, user.lastName, user.profilePicture, user.id]
  )
  await actionEmailChange(user, existingUser)
}

const actionEmailChange = async (user: User, existingUser: User): Promise<void> => {
  const emailChanged: boolean = user.email !== existingUser.email
  if (emailChanged) {
    user.validateToken = newToken()
    user.validateTokenExpires = new Date(Date.now() + (5 * 1000 * 60))
    user.verifiedEmail = false
    await pool.query(
      `UPDATE users
      SET verified_email = FALSE, validate_token = ?, validate_token_expires = ?
      WHERE id = ?`,
      [user.validateToken, user.validateTokenExpires, user.id]
    )
    sendValidateEmail(user)
  }
}
