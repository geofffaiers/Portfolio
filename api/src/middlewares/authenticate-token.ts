import { WebSocket } from 'ws';
import { NextFunction, Request, Response } from 'express';
import { JWTPayload, jwtVerify } from 'jose';
import { logError, pool } from '@src/helpers';
import { RowDataPacket } from 'mysql2';
import crypto from 'node:crypto';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | undefined = req.cookies.token;
    if (token == null || typeof token !== 'string') {
        res.status(401).json({
            code: 401,
            success: false,
            message: 'Unauthorized'
        });
        return;
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secret);
        const userId = payload.userId as number;

        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const tokenHash = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');

            const [sessions] = await pool.query<RowDataPacket[]>(
                `SELECT id FROM users_sessions 
                 WHERE user_id = ? AND refresh_token = ? 
                 AND is_active = 1 AND expires_at > NOW()`,
                [userId, tokenHash]
            );

            if (sessions.length === 0) {
                res.clearCookie('token');
                res.clearCookie('refreshToken');
                res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'Invalid session'
                });
                return;
            }
        } else {
            res.clearCookie('token');
            res.clearCookie('refreshToken');
            res.status(401).json({
                code: 401,
                success: false,
                message: 'Invalid session'
            });
            return;
        }
        req.userId = userId;
        next();
    } catch (err: unknown) {
        logError(err);
        res.status(403).json({
            code: 403,
            success: false,
            message: 'Forbidden'
        });
    }
};

export const authenticateTokenForSocket = async (ws: WebSocket, req: Request): Promise<number> => {
    const token: string | undefined = req.cookies?.token ?? req.headers?.cookie?.split(';')?.find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (token == null || typeof token !== 'string') {
        ws.close(1008, 'Unauthorized');
        return -1;
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secret);
        const userId = payload.userId as number;

        const refreshToken = req.cookies?.refreshToken ?? req.headers?.cookie?.split(';')?.find(c => c.trim().startsWith('refreshToken='))?.split('=')[1];

        if (refreshToken) {
            const tokenHash = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');

            const [sessions] = await pool.query<RowDataPacket[]>(
                `SELECT id FROM users_sessions 
                 WHERE user_id = ? AND refresh_token = ? 
                 AND is_active = 1 AND expires_at > NOW()`,
                [userId, tokenHash]
            );

            if (sessions.length === 0) {
                ws.close(1008, 'Invalid session');
                return -1;
            }
        } else {
            ws.close(1008, 'Invalid session');
            return -1;
        }

        return userId;
    } catch (err: unknown) {
        logError(err);
        ws.close(1008, 'Forbidden');
        return -1;
    }
};
