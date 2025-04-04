import { WebSocket } from 'ws';
import { NextFunction, Request, Response } from 'express';
import { JWTPayload, jwtVerify } from 'jose';
import { logError } from '../helpers';

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
        req.userId = payload.userId as number;
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
        return payload.userId as number;
    } catch (err: unknown) {
        logError(err);
        ws.close(1008, 'Forbidden');
        return -1;
    }
};
