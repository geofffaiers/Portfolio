import { pool } from './db'

export const reportError = async (err: Error): Promise<void> => {
  await pool.query('INSERT INTO errors (message) VALUES (?)', [err.message])
}
