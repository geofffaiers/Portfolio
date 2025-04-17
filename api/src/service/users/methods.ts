import crypto from 'crypto';
import { SignJWT } from 'jose';
import { Session, User } from '../../models';
import { pool } from '../../helpers/db';
import { RowDataPacket } from 'mysql2';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CookieOptions, Request, Response } from 'express';
import { getLocationFromIp } from '../../helpers/geo-location';

export const delay = async (ms: number): Promise<void> => await new Promise(resolve => setTimeout(resolve, ms));

export const getUser = async (userId: number): Promise<User> => {
    const [result] = await pool.query<User[] & RowDataPacket[]>(
        `SELECT *
        FROM users
        WHERE id = ?`,
        [userId]
    );
    if (result.length === 0) {
        throw new Error('User not found');
    }
    const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true });
    await validateOrReject(user);
    return user;
};

export const generateJwt = async (userId: number, duration: string): Promise<string> => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('https://www.gfaiers.com')
        .setIssuedAt()
        .setExpirationTime(duration)
        .sign(secret);
    return jwt;
};

export const addToPreviousPasswords = async (user: User): Promise<void> => {
    await pool.query(
        `INSERT INTO previous_passwords
      (user_id, password)
    VALUES
      (?, ?)`,
        [user.id, user.password]
    );
};

export const newToken = (): string => {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token: string = '';
    for (let i = 0; i < 16; i++) {
        const randomIndex: number = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    return token;
};

export const getCurrentSessions = async (req: Request, userId: number): Promise<Session[]> => {
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
    return enhancedSessions;
};

export const saveToUserSessions = async (userId: number, req: Request, res: Response, existingTokenHash?: string): Promise<void> => {
    const accessToken = await generateJwt(userId, '2h');
    const refreshToken = await generateJwt(userId, '7d');

    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.socket.remoteAddress || '';
    const location = await getLocationFromIp(ip);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    if (existingTokenHash == null) {
        await pool.query(
            `INSERT INTO users_sessions 
            (user_id, refresh_token, user_agent, ip_address, location, is_active, expires_at) 
            VALUES (?, ?, ?, ?, ?, 1, ?)`,
            [userId, tokenHash, userAgent, ip, location?.location ?? null, expiresAt]
        );
    } else {
        await pool.query(
            `UPDATE users_sessions SET
                refresh_token = ?,
                user_agent = ?,
                ip_address = ?,
                location = ?,
                is_active = 1,
                expires_at = ?,
                updated_at = NOW()
            WHERE refresh_token = ?`,
            [tokenHash, userAgent, ip, location?.location ?? null, expiresAt, existingTokenHash]
        );
    }
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
};
