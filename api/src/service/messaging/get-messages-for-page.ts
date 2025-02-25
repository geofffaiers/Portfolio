import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { handleError, pool } from '../../helpers';
import { DefaultResponse, Message } from '../../models';

export const getMessagesForPage = async (req: Request): Promise<DefaultResponse<Message[]>> => {
    try {
        const { userId, page } = req.query;
        if (userId == null || page == null) {
            return {
                code: 400,
                success: false,
                message: 'Missing required fields.'
            };
        }
        const pageNumber: number = parseInt(page as string);
        const [result] = await pool.query<Message[] & RowDataPacket[]>(
            `SELECT *
      FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
      OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at DESC
      LIMIT ?
      OFFSET ?`,
            [userId, req.userId, req.userId, userId, 20 * (pageNumber + 1), 20 * pageNumber]
        );
        if (result.length === 0) {
            return {
                code: 200,
                success: true,
                data: []
            };
        }
        const messages: Message[] = plainToInstance(Message, result, { excludeExtraneousValues: true });
        await Promise.all(messages.map((m: Message) => validateOrReject(m)));
        return {
            code: 200,
            success: true,
            data: messages
        };
    } catch (err: unknown) {
        return handleError<Message[]>(err);
    }
};
