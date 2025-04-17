import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../helpers/db';
import { DefaultResponse, GetSessions, User } from '../../models';
import { handleError } from '../../helpers';
import { getCurrentSessions } from './methods';

export const logoutSession = async (req: Request): Promise<DefaultResponse<GetSessions>> => {
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

        await pool.query(
            'UPDATE users_sessions SET is_active = 0 WHERE id = ?',
            [req.params.sessionId]
        );

        return {
            code: 200,
            success: true,
            data: {
                sessions: await getCurrentSessions(req, userId)
            }
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};
