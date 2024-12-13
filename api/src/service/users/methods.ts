import { SignJWT } from 'jose'
import { User } from '../../models'
import { pool } from '../../helpers/db'

export const delay = async (ms: number): Promise<void> => await new Promise(resolve => setTimeout(resolve, ms))

export const generateJwt = async (userId: number, duration: string): Promise<string> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('https://www.gfaiers.com')
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(secret)
  return jwt
}

export const addToPreviousPasswords = async (user: User): Promise<void> => {
  await pool.query(
    `INSERT INTO previous_passwords
      (user_id, password)
    VALUES
      (?, ?)`,
    [user.id, user.password]
  )
}

export const newToken = (): string => {
  const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token: string = ''
  for (let i = 0; i < 16; i++) {
    const randomIndex: number = Math.floor(Math.random() * chars.length)
    token += chars[randomIndex]
  }
  return token
}
