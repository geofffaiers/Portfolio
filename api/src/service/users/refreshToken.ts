import { CookieOptions, Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { DefaultResponse, ErrorCheck, User } from '../../models'
import { generateJwt, getUser } from './methods'
import { handleError } from '../../helpers'


export const refreshToken = async (req: Request, res: Response): Promise<DefaultResponse> => {
  try {
    const [error, userId]: ErrorCheck<number> = await getUserId(req)
    if (error != null) {
      return {
        code: 400,
        success: false,
        message: error
      }
    }
    await getUser(userId)
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
    res.cookie('token', await generateJwt(userId, '2h'), cookieOptions)
    return {
      code: 200,
      success: true
    }
  } catch (err: unknown) {
    return handleError(err)
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
