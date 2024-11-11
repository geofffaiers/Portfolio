import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { ResultSetHeader } from 'mysql2'
import { pool } from '../../helpers/db'
import { DefaultResponse, User } from '../../models'
import bcrypt from 'bcrypt'

export const create = async (req: Request): Promise<DefaultResponse<User>> => {
  try {
    const user: User = plainToInstance(User, req.body)
    user.id = 0
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
    return {
      success: true,
      data: user
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
