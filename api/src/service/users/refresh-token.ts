import crypto from 'crypto';
import { CookieOptions, Request, Response } from 'express';
import { DefaultResponse } from '../../models';
import { generateJwt, getUser } from './methods';
import { handleError, pool } from '../../helpers';
import { RowDataPacket } from 'mysql2';

export const refreshToken = async (req: Request, res: Response): Promise<DefaultResponse> => {
    try {
        const refreshToken: string | undefined = req.cookies.refreshToken;
        if (refreshToken == null || typeof refreshToken !== 'string') {
            return {
                code: 401,
                success: false,
                message: 'Invalid refresh token'
            };
        }

        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        const [sessions] = await pool.query<RowDataPacket[]>(
            `SELECT user_id, is_active, expires_at 
             FROM users_sessions 
             WHERE refresh_token = ? AND is_active = 1 AND expires_at > NOW()`,
            [tokenHash]
        );

        if (sessions.length === 0) {
            res.clearCookie('token');
            res.clearCookie('refreshToken');
            return {
                code: 401,
                success: false,
                message: 'Invalid or expired session'
            };
        }

        const session = sessions[0];
        const userId = session.user_id;

        await getUser(userId);

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };
        const newAccessToken = await generateJwt(userId, '2h');
        const newRefreshToken = await generateJwt(userId, '7d');
        const newTokenHash = crypto
            .createHash('sha256')
            .update(newRefreshToken)
            .digest('hex');

        await pool.query(
            'UPDATE users_sessions SET refresh_token = ?, updated_at = NOW() WHERE refresh_token = ?',
            [newTokenHash, tokenHash]
        );

        res.cookie('token', newAccessToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        return {
            code: 200,
            success: true
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};
