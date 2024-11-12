import bcrypt from 'bcrypt'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { RowDataPacket } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import { generateJwt } from './methods'

const delay = async (ms: number): Promise<void> => await new Promise(resolve => setTimeout(resolve, ms))

interface Res {
  user: User
  token: string
  refreshToken: string
}

export const login = async (req: Request): Promise<DefaultResponse<Res>> => {
  try {
    await delay(1000)
    const { username, password } = req.body
    const [result] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )
    if (result.length === 0) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true })
    await validateOrReject(user)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid password'
      }
    }
    user.password = ''
    return {
      success: true,
      data: {
        user,
        token: await generateJwt(user, '2h'),
        refreshToken: await generateJwt(user, '7d')
      }
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
