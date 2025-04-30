import crypto from 'crypto';
import { Request, Response } from 'express';
import { DefaultResponse } from '../../models';
import { getUser, saveToUserSessions } from './methods';
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
        await saveToUserSessions(userId, req, res, tokenHash);

        return {
            code: 200,
            success: true
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};
