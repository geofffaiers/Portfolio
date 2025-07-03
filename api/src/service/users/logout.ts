import crypto from 'node:crypto';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../helpers/db';
import { DefaultResponse, User } from '../../models';
import { handleError } from '../../helpers';

export const logout = async (req: Request, res: Response): Promise<DefaultResponse> => {
    try {
        const userId: number | undefined = req.userId;
        if (userId == null) {
            return {
                code: 400,
                success: false,
                message: 'Not logged in'
            };
        }
        const [result] = await pool.query<User[] & RowDataPacket[]>(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        if (result.length === 0) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const tokenHash = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');

            await pool.query(
                'UPDATE users_sessions SET is_active = 0 WHERE refresh_token = ?',
                [tokenHash]
            );
        }
        res.clearCookie('token');
        res.clearCookie('refreshToken');

        return {
            code: 200,
            success: true
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};
