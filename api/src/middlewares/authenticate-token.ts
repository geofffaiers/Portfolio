import crypto from 'node:crypto';
import { WebSocket } from 'ws';
import { NextFunction, Request, Response } from 'express';
import { JWTPayload, jwtVerify } from 'jose';
import { RowDataPacket } from 'mysql2';

import { logError, pool } from '@src/helpers';

export const authenticateGuest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | undefined = req.cookies.token;
    if (token) {
        req.guestSessionId = undefined;
        // If a token is present, skip guest authentication as it's a user session
        next();
    }
    const guestSessionToken = req.cookies.guestSessionToken;
    if (guestSessionToken == null || typeof guestSessionToken !== 'string') {
        res.status(401).json({
            code: 401,
            success: false,
            message: 'Unauthorized'
        });
        return;
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: { payload: JWTPayload } = await jwtVerify(guestSessionToken, secret);
        const guestSessionId = payload.guestSessionId as string;

        if (guestSessionId) {
            const [sessions] = await pool.query<RowDataPacket[]>(
                `SELECT id FROM pp_room_players 
                 WHERE guest_session_id = ?
                 AND updated_at > NOW() - INTERVAL 7 DAY`,
                [guestSessionId]
            );

            if (sessions.length === 0) {
                res.clearCookie('guestSessionToken');
                res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'Invalid session'
                });
                return;
            }
        } else {
            res.clearCookie('guestSessionToken');
            res.status(401).json({
                code: 401,
                success: false,
                message: 'Invalid session'
            });
            return;
        }
        req.guestSessionId = guestSessionId;
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


export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.guestSessionId) {
        // Skip authentication for guest sessions
        req.userId = undefined;
        next();
        return;
    }
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

export const socketAuthentication = async (ws: WebSocket, req: Request): Promise<[number | null, string | null]> => {
    const guestSessionToken: string | undefined =
        req.cookies.guestSessionToken ??
        getCookieValue(req.headers?.cookie, 'guestSessionToken');

    if (guestSessionToken != null && typeof guestSessionToken === 'string') {
        return [null, await guestForSocket(guestSessionToken, ws)];
    }

    const token: string | undefined =
        req.cookies.token ??
        getCookieValue(req.headers?.cookie, 'token');

    if (token != null && typeof token === 'string') {
        return [await userForSocket(token, ws, req), null];
    }
    ws.close(1008, 'Unauthorized');
    return [null, null];
};

function getCookieValue(cookieHeader: string | undefined, key: string): string | undefined {
    if (!cookieHeader) return undefined;
    const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined;
}


const guestForSocket = async (guestSessionToken: string, ws: WebSocket): Promise<string | null> => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: { payload: JWTPayload } = await jwtVerify(guestSessionToken, secret);
        const guestSessionId = payload.guestSessionId as string;

        const [sessions] = await pool.query<RowDataPacket[]>(
            `SELECT id FROM pp_room_players 
            WHERE guest_session_id = ?
            AND updated_at > NOW() - INTERVAL 7 DAY`,
            [guestSessionId]
        );

        if (sessions.length === 0) {
            ws.close(1008, 'Invalid session');
            return null;
        }

        return guestSessionId;
    } catch (err: unknown) {
        logError(err);
        ws.close(1008, 'Forbidden');
        return null;
    }
};

const userForSocket = async (token: string, ws: WebSocket, req: Request): Promise<number | null> => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secret);
        const userId = payload.userId as number;

        const refreshToken: string | undefined =
            req.cookies?.refreshToken ||
            getCookieValue(req.headers?.cookie, 'refreshToken');

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
                return null;
            }
        } else {
            ws.close(1008, 'Invalid session');
            return null;
        }

        return userId;
    } catch (err: unknown) {
        logError(err);
        ws.close(1008, 'Forbidden');
        return null;
    }
};
