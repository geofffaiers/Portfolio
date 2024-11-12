import { NextFunction, Request, Response } from 'express'
import { JWTPayload, jwtVerify } from 'jose'

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const headers = req.headers
  const authHeader = headers['authorization'] || headers['Authorization']
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    })
    return
  }
  const token = authHeader.split(' ')[1]
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload }: { payload: JWTPayload} = await jwtVerify(token, secret)
    req.userId = payload.userId as number
    next()
  } catch (err: any) {
    res.status(403).send('Forbidden')
  }
}