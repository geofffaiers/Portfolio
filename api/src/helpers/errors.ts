import { DefaultResponse } from '../models'
import { pool } from './db'

export const reportError = async (err: Error): Promise<void> => {
  await pool.query('INSERT INTO errors (message) VALUES (?)', [err.message])
}

export const handleError = <T = undefined>(err: unknown): DefaultResponse<T> => {
  if (err instanceof Error) {
    return {
      code: 500,
      success: false,
      message: err.message
    }
  }
  throw new Error('An unexpected error occurred')
}