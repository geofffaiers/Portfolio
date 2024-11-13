import { CookieOptions, Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { DefaultResponse, ErrorCheck } from '../../models'
import { generateJwt } from './methods'


export const refreshToken = async (req: Request, res: Response): Promise<DefaultResponse<undefined>> => {
  try {
    
    const [error, userId]: ErrorCheck<number> = await getUserId(req)
    if (error != null) {
      return {
        success: false,
        message: error
      }
    }
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
    res.cookie('token', await generateJwt(userId, '2h'), cookieOptions)
    return {
      success: true
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Invalid refresh token'
    }
  }
}

const getUserId = async (req: Request): Promise<ErrorCheck<number>> => {
  const refreshToken: string | undefined = req.cookies.refreshToken
  if (refreshToken == null || typeof refreshToken !== 'string') {
    return ['Invalid refresh token', null]
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jwtVerify(refreshToken, secret)
  if (typeof payload.userId !== 'number') {
    return ['Invalid refresh token', null]
  }
  const userId: number = payload.userId
  return [null, userId]
}
