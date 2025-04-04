import { plainToInstance } from 'class-transformer';
import { Client, Message, MessageType, NewMessage, SocketMessage } from '../../../models';
import { sendErrorToClient, sendMessageToClient } from '../../sockets/methods';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../../helpers';
import { validateOrReject } from 'class-validator';

export const newMessageHandler = async (client: Client, message: SocketMessage): Promise<void> => {
    try {
        const request: NewMessage = plainToInstance(NewMessage, message, { excludeExtraneousValues: true });
        const toMessage: Message = await saveMessageToDatabase(client, request);
        const response: NewMessage = {
            type: MessageType.NEW_MESSAGE,
            message: toMessage
        };
        sendMessageToClient(response, toMessage.receiverId);
        sendMessageToClient(response, toMessage.senderId);
    } catch (err: unknown) {
        sendErrorToClient(err, client);
    }
};

const saveMessageToDatabase = async (client: Client, request: NewMessage): Promise<Message> => {
    const message: Message = request.message;
    if (message.senderId !== client.userId) {
        throw new Error('You are not the sender of this message');
    }
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO messages (sender_id, receiver_id, content)
        VALUES (?, ?, ?)`,
        [message.senderId, message.receiverId, message.content]
    );
    const [rows] = await pool.query<Message[] & RowDataPacket[]>(
        'SELECT * FROM messages WHERE id = ?',
        [result.insertId]
    );
    const savedMessage: Message = plainToInstance(Message, rows[0], { excludeExtraneousValues: true });
    await validateOrReject(savedMessage);
    return savedMessage;
};
