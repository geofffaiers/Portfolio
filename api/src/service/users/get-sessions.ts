import crypto from 'crypto';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { handleError, pool } from '../../helpers';
import { DefaultResponse, GetSessions, Session } from '../../models';

export const getSessions = async (req: Request): Promise<DefaultResponse<GetSessions>> => {
    try {
        const userId: number | undefined = req.userId;
        if (userId == null) {
            return {
                code: 400,
                success: false,
                message: 'Not logged in'
            };
        }

        const currentRefreshToken = req.cookies?.refreshToken;
        let currentTokenHash: string | null = null;
        if (currentRefreshToken) {
            currentTokenHash = crypto
                .createHash('sha256')
                .update(currentRefreshToken)
                .digest('hex');
        }

        const [result] = await pool.query<Session[] & RowDataPacket[]>(
            `SELECT
                *
            FROM users_sessions
            WHERE user_id = ?
                AND is_active = 1
                AND expires_at > NOW()
            ORDER BY updated_at DESC`,
            [userId]
        );
        const sessions = plainToInstance(Session, result, { excludeExtraneousValues: true });
        const enhancedSessions = sessions.map(session => {
            const isCurrentSession = currentTokenHash === session.refreshToken;
            return {
                ...session,
                refreshToken: undefined,
                thisSession: isCurrentSession
            };
        });

        await validateOrReject(enhancedSessions);
        return {
            code: 200,
            success: true,
            data: {
                sessions: enhancedSessions
            }
        };
    } catch (err: unknown) {
        return handleError<GetSessions>(err);
    }
};
