import bcrypt from 'bcrypt';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../helpers/db';
import { DefaultResponse, User } from '../../models';
import { addToPreviousPasswords, newToken } from './methods';
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core';
import { handleError, sendValidateEmail } from '../../helpers';

export const create = async (req: Request): Promise<DefaultResponse<User>> => {
    try {
        const user: User = plainToInstance(User, req.body, { excludeExtraneousValues: true });
        user.id = 0;
        const uniqueUsername = await isUsernameUnique(user.username);
        const uniqueEmail = await isEmailUnique(user.email);
        if (uniqueUsername === false && uniqueEmail === false) {
            return {
                code: 400,
                success: false,
                message: 'Username and email are already taken'
            };
        }
        if (uniqueUsername === false) {
            return {
                code: 400,
                success: false,
                message: 'Username is already taken'
            };
        }
        if (uniqueEmail === false) {
            return {
                code: 400,
                success: false,
                message: 'Email is already taken'
            };
        }
        const passwordStrength: ZxcvbnResult = zxcvbn(user.password);
        if (passwordStrength.score < 3) {
            let message: string = passwordStrength.feedback.warning ?? '';
            if (passwordStrength.feedback.suggestions.length > 0) {
                message += ` ${passwordStrength.feedback.suggestions.join(' ')}`;
            }
            return {
                code: 400,
                success: false,
                message
            };
        }
        user.password = await bcrypt.hash(user.password, 10);
        await validateOrReject(user);
        user.validateToken = newToken();
        user.validateTokenExpires = new Date(Date.now() + (5 * 1000 * 60));
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO users
                (username, password, email, first_name, last_name, validate_token, validate_token_expires)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)`,
            [user.username, user.password, user.email, user.firstName, user.lastName, user.validateToken, user.validateTokenExpires]
        );
        user.id = result.insertId;
        await addToPreviousPasswords(user);
        await addInitialMessage(user);
        await sendValidateEmail(user);
        return {
            code: 201,
            success: true,
            data: user
        };
    } catch (err: unknown) {
        return handleError<User>(err);
    }
};

const isUsernameUnique = async (username: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE username = ?', [username]);
    return rows.length === 0;
};

const isEmailUnique = async (email: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
    return rows.length === 0;
};

const addInitialMessage = async (user: User): Promise<void> => {
    await pool.query<ResultSetHeader>(
        `INSERT INTO messages
            (sender_id, receiver_id, content)
        VALUES
            (?, ?, ?)`,
        [1, user.id, `Welcome to my portfolio, ${user.username}. Please feel free to message me anytime!`]
    );
};
