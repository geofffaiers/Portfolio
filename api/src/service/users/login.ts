import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { CookieOptions, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../helpers/db';
import { DefaultResponse, User } from '../../models';
import { delay, generateJwt } from './methods';
import { handleError } from '../../helpers';
import { getLocationFromIp } from '../../helpers/geo-location';

export const login = async (req: Request, res: Response): Promise<DefaultResponse<User>> => {
    try {
        await delay(1000);
        const { username, password } = req.body;
        const [result] = await pool.query<User[] & RowDataPacket[]>(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (result.length === 0) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true });
        await validateOrReject(user);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                code: 400,
                success: false,
                message: 'Invalid password'
            };
        }
        user.password = '';
        await saveToUserSessions(user, req, res);
        return {
            code: 200,
            success: true,
            data: user
        };
    } catch (err: unknown) {
        return handleError<User>(err);
    }
};

const saveToUserSessions = async (user: User, req: Request, res: Response): Promise<void> => {
    const accessToken = await generateJwt(user.id, '2h');
    const refreshToken = await generateJwt(user.id, '7d');

    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.socket.remoteAddress || '';
    const location = await getLocationFromIp(ip);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    await pool.query(
        `INSERT INTO users_sessions 
        (user_id, refresh_token, user_agent, ip_address, location, is_active, expires_at) 
        VALUES (?, ?, ?, ?, ?, 1, ?)`,
        [user.id, tokenHash, userAgent, ip, location?.location ?? null, expiresAt]
    );
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
};
