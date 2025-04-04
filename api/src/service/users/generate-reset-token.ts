import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { handleError, pool, sendResetPasswordEmail } from '../../helpers';
import { DefaultResponse, User } from '../../models';
import { newToken } from './methods';

export const generateResetToken = async (req: Request): Promise<DefaultResponse> => {
    try {
        const { email } = req.body;
        if (email == null) {
            return {
                code: 400,
                success: false,
                message: 'Email is required'
            };
        }
        const [result] = await pool.query<User[] & RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
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
        user.resetToken = newToken();
        user.resetTokenExpires = new Date(Date.now() + (5 * 1000 * 60));

        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [user.resetToken, user.resetTokenExpires, user.id]
        );
        await sendResetPasswordEmail(user);
        user.password = '';
        return {
            code: 200,
            success: true
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};
