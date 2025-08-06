import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../helpers/db';
import { DefaultResponse, User } from '../../models';
import { delay, saveToUserSessions } from './methods';
import { handleError } from '../../helpers';

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
        res.clearCookie('guestSessionToken');
        await saveToUserSessions(user.id, req, res);

        return {
            code: 200,
            success: true,
            data: user
        };
    } catch (err: unknown) {
        return handleError<User>(err);
    }
};
