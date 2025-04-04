import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { handleError, pool } from '../../helpers';
import { DefaultResponse, User } from '../../models';
import { delay } from './methods';

export const getUserForResetToken = async (req: Request): Promise<DefaultResponse<User>> => {
    try {
        const { resetToken } = req.query;
        if (resetToken == null) {
            return {
                code: 400,
                success: false,
                message: 'Reset token is required'
            };
        }
        await delay(1000);
        const [result] = await pool.query<User[] & RowDataPacket[]>(
            'SELECT * FROM users WHERE reset_token = ?',
            [resetToken]
        );
        if (result.length === 0) {
            return {
                code: 400,
                success: false,
                message: 'Reset token is invalid'
            };
        }
        const user: User = plainToInstance(User, result[0], { excludeExtraneousValues: true });
        await validateOrReject(user);
        if (user.resetTokenExpires != null && user.resetTokenExpires.getTime() < new Date().getTime()) {
            return {
                code: 400,
                success: false,
                message: 'Reset token has expired'
            };
        }
        return {
            code: 200,
            success: true,
            data: user
        };
    } catch (err: unknown) {
        return handleError<User>(err);
    }
};
