import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RowDataPacket } from 'mysql2';
import { handleError, pool } from '../../../helpers';
import { ChatHeader, DefaultResponse, Message, User } from '../../../models';

export const getChatHeaders = async (req: Request): Promise<DefaultResponse<ChatHeader[]>> => {
    try {
        const users: User[] = await getUsers(req.userId);
        if (users.length === 0) {
            return {
                code: 400,
                success: false,
                message: 'User has no conversations'
            };
        }
        const messages: Message[] = await getLatestMessages(req.userId);
        const chatHeaders: ChatHeader[] = await Promise.all(users.map(async (u: User) => {
            const message: Message | undefined = messages.find((m: Message) => m.senderId === u.id || m.receiverId === u.id);
            const lastReceivedMessage: Message | undefined = await getLastReceivedMessage(req.userId, u.id);
            return {
                user: u,
                lastMessage: message,
                lastReceivedMessage
            };
        }));
        return {
            code: 200,
            success: true,
            data: chatHeaders
        };
    } catch (err: unknown) {
        return handleError<ChatHeader[]>(err);
    }
};

const getUsers = async (userId: number | undefined): Promise<User[]> => {
    const [result] = await pool.query<User[] & RowDataPacket[]>(
        `SELECT DISTINCT u.*
    FROM users u
    JOIN messages m
      ON (u.id = m.receiver_id AND m.sender_id = ?)
      OR (u.id = m.sender_id AND m.receiver_id = ?)
    ORDER BY (
      SELECT MAX(m2.created_at)
      FROM messages m2
      WHERE
        (m2.receiver_id = u.id AND m2.sender_id = ?)
        OR (m2.sender_id = u.id AND m2.receiver_id = ?)
    ) DESC`,
        [userId, userId, userId, userId]
    );
    if (result.length === 0) {
        return [];
    }
    const users: User[] = plainToInstance(User, result, { excludeExtraneousValues: true });
    users.forEach((u: User) => u.password = '');
    await Promise.all(users.map((u: User) => validateOrReject(u)));
    return users;
};

const getLatestMessages = async (userId: number | undefined): Promise<Message[]> => {
    const [result] = await pool.query<Message[] & RowDataPacket[]>(
        `SELECT m.*
    FROM (
	    SELECT
        m.*,
		    ROW_NUMBER() OVER (
          PARTITION BY
			      GREATEST(m.sender_id, m.receiver_id),
			      LEAST(m.sender_id, m.receiver_id)
			    ORDER BY m.created_at DESC
        )
			AS rn
      FROM messages m
      WHERE m.sender_id = ? OR m.receiver_id = ?
    ) m
		WHERE m.rn = 1`,
        [userId, userId]
    );
    return plainToInstance(Message, result, { excludeExtraneousValues: true });
};

const getLastReceivedMessage = async (userId: number | undefined, otherUserId: number): Promise<Message | undefined> => {
    const [result] = await pool.query<Message[] & RowDataPacket[]>(
        `SELECT *
    FROM messages
    WHERE sender_id = ? AND receiver_id = ?
    ORDER BY id DESC
    LIMIT 1`,
        [otherUserId, userId]
    );
    if (result.length === 0) {
        return;
    }
    const message: Message = plainToInstance(Message, result, { excludeExtraneousValues: true })[0];
    await validateOrReject(message);
    return message;
};
