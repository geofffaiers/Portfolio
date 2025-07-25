import type { CookieOptions, Request, Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

import type { DefaultResponse } from '../../../models';
import { handleError, pool } from '../../../helpers';
import { generateJwt } from '@src/service/users/methods';
import { JWTPayload, jwtVerify } from 'jose';

export const connectGuest = async (req: Request, res: Response): Promise<DefaultResponse> => {
    try {
        const message = await connectGuestSession(req, res);
        if (message) {
            return {
                success: false,
                code: 400,
                message
            };
        }

        return {
            success: true,
            code: 200
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

const connectGuestSession = async (req: Request, res: Response): Promise<string | void> => {
    const guestSessionToken: string | undefined = req.cookies.guestSessionToken;
    if (guestSessionToken == null || typeof guestSessionToken !== 'string') {
        return await generateNewGuestSession(req, res);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: JWTPayload } = await jwtVerify(guestSessionToken, secret);
    const guestSessionId = payload.guestSessionId as string;
    if (guestSessionId == null) {
        res.clearCookie('guestSessionToken');
        return 'Invalid request';
    }

    const { guestName, roomId } = req.body;
    if (typeof guestName !== 'string' || guestName.length < 1 || guestName.length > 32) {
        return 'Invalid request';
    }
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM pp_rooms WHERE id = ?',
        [roomId]
    );
    if (rows.length === 0) {
        return 'Invalid request';
    }
    const [updatedRows] = await pool.query<ResultSetHeader>(
        `UPDATE pp_room_players SET
            guest_name = ?
        WHERE guest_session_id = ?
        `,
        [guestName, guestSessionId]
    );
    if (updatedRows.affectedRows > 0) {
        await generateNewGuestToken(guestSessionId, res);
        return;
    }
};

const generateNewGuestSession = async (req: Request, res: Response): Promise<string | void> => {
    const { guestName, roomId } = req.body;
    if (typeof guestName !== 'string' || guestName.length < 1 || guestName.length > 32) {
        return 'Invalid request';
    }
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM pp_rooms WHERE id = ?',
        [roomId]
    );
    if (rows.length === 0) {
        return 'Invalid request';
    }
    const guestSessionId = crypto.randomUUID();
    await pool.query(
        `INSERT INTO pp_room_players
            (room_id, guest_session_id, guest_name, online)
        VALUES
            (?, ?, ?, 1)`,
        [roomId, guestSessionId, guestName]
    );
    await generateNewGuestToken(guestSessionId, res);
};

const generateNewGuestToken = async (guestSessionId: string, res: Response) => {
    const guestSessionToken = await generateJwt('7d', undefined, guestSessionId);
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
    res.cookie('guestSessionToken', guestSessionToken, cookieOptions);
};
