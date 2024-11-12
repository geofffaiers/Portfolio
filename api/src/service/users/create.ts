import bcrypt from 'bcrypt'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { ResultSetHeader } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { addToPreviousPasswords } from './methods'
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core'

export const create = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const user: User = plainToInstance(User, req.body, { excludeExtraneousValues: true })
    user.id = 0
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
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
