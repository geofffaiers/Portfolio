import type { CookieOptions, Request, Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

import type { DefaultResponse } from '../../../models';
import { handleError, pool } from '../../../helpers';
import { generateJwt } from '@src/service/users/methods';
import { JWTPayload, jwtVerify } from 'jose';

type ErrorTuple = [string | null, number[] | null];

export const connectGuest = async (req: Request, res: Response): Promise<DefaultResponse<{ ids: number[] }>> => {
    try {
        const [error, playerIds] = await connectGuestSession(req, res);
        if (error) {
            return {
                success: false,
                code: 400,
                message: error
            };
        }

        return {
            success: true,
            code: 200,
            data: {
                ids: playerIds || [],
            }
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

const connectGuestSession = async (req: Request, res: Response): Promise<ErrorTuple> => {
    const guestSessionToken: string | undefined = req.cookies.guestSessionToken;
    if (guestSessionToken == null || typeof guestSessionToken !== 'string') {
        return await generateNewGuestSession(req, res);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }: { payload: JWTPayload } = await jwtVerify(guestSessionToken, secret);
    const guestSessionId = payload.guestSessionId as string;
    if (guestSessionId == null) {
        res.clearCookie('guestSessionToken');
        return ['Invalid request', null];
    }

    const { guestName, roomId } = req.body;
    if (isInvalidGuestName(guestName)) {
        return ['Invalid request', null];
    }
    const [roomRows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM pp_rooms WHERE id = ?',
        [roomId]
    );
    if (roomRows.length === 0) {
        return ['Invalid request', null];
    }
    const [playerRows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM pp_room_players WHERE guest_session_id = ?',
        [guestSessionId]
    );
    if (playerRows.length === 0) {
        return ['Invalid request', null];
    }
    await pool.query<ResultSetHeader>(
        `UPDATE pp_room_players SET
            guest_name = ?
        WHERE guest_session_id = ?
        `,
        [guestName, guestSessionId]
    );
    await generateNewGuestToken(guestSessionId, res);
    return [null, playerRows.map((row) => row.id)];
};

const isInvalidGuestName = (name: string): boolean => {
    return typeof name !== 'string' || name.length < 1 || name.length > 32;
};

const generateNewGuestSession = async (req: Request, res: Response): Promise<ErrorTuple> => {
    const { guestName, roomId } = req.body;
    if (isInvalidGuestName(guestName)) {
        return ['Invalid request', null];
    }
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM pp_rooms WHERE id = ?',
        [roomId]
    );
    if (rows.length === 0) {
        return ['Invalid request', null];
    }
    const guestSessionId = crypto.randomUUID();
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO pp_room_players
            (room_id, guest_session_id, guest_name, online)
        VALUES
            (?, ?, ?, 1)`,
        [roomId, guestSessionId, guestName]
    );
    await generateNewGuestToken(guestSessionId, res);
    return [null, [result.insertId]];
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
