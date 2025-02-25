import bcrypt from 'bcrypt';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../helpers/db';
import { DefaultResponse, User } from '../../models';
import { addToPreviousPasswords } from './methods';
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core';
import { handleError } from '../../helpers';

export const resetPassword = async (req: Request): Promise<DefaultResponse> => {
    try {
        const { userId, newPassword, resetToken } = req.body;
        if (userId == null || newPassword == null || resetToken == null) {
            return {
                code: 400,
                success: false,
                message: 'Missing required fields'
            };
        }
        const [result] = await pool.query<User[] & RowDataPacket[]>(
            'SELECT * FROM users WHERE id = ? AND reset_token = ?',
            [userId, resetToken]
        );
        if (result.length === 0) {
            return {
                code: 400,
                success: false,
                message: 'Invalid reset token'
            };
        }
        const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true });
        await validateOrReject(user);
        const passwordStrength: ZxcvbnResult = zxcvbn(newPassword);
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
        user.password = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [user.password, userId]
        );
        await addToPreviousPasswords(user);
        return {
            code: 200,
            success: true
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};
