import { Request } from 'express'
import { pool, sendContactEmail } from '../../helpers'
import { DefaultResponse } from '../../models'

export const contact = async (req: Request): Promise<DefaultResponse<undefined>> => {
  try {
    const { name, email, message } = req.body
    if (name == null || email == null || message == null) {
      return {
        success: false,
        message: 'Missing required fields.'
      }
    }
    await pool.query(
      `INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)`,
      [name, email, message]
    )
    await sendContactEmail(name, email, message)
    return {
      success: true
    }
  } catch (err: any) {
    throw new Error(err)
  }
}
