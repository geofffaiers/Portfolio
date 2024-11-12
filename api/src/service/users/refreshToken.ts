import { Request } from 'express'
import { jwtVerify, SignJWT } from 'jose'
import { DefaultResponse } from '../../models'

interface Res {
  token: string
}

export const refreshToken = async (req: Request): Promise<DefaultResponse<Res>> => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return {
      success: false,
      message: 'Refresh token is required'
    }
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(refreshToken, secret)

    const token = await new SignJWT({ userId: payload.userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret)

    return {
      success: true,
      data: { token }
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Invalid refresh token'
    }
  }
}
