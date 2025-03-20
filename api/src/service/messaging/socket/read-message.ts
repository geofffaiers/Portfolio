import { plainToInstance } from "class-transformer";
import { Client, Message, MessageType, ReadMessage, SocketMessage, UpdatedMessage } from "../../../models";
import { sendErrorToClient, sendMessageToClient } from "../../sockets/methods";
import { RowDataPacket } from "mysql2";
import { validateOrReject } from "class-validator";
import { pool } from "../../../helpers";

export const readMessageHandler = async (client: Client, message: SocketMessage): Promise<void> => {
    try {
        const request: ReadMessage = plainToInstance(ReadMessage, message, { excludeExtraneousValues: true });
        const toMessage: Message = await updateMessageInDatabase(client, request);
        const response: UpdatedMessage = {
            type: MessageType.UPDATED_MESSAGE,
            message: toMessage
        };
        sendMessageToClient(response, toMessage.receiverId);
        sendMessageToClient(response, toMessage.senderId);
    } catch (err: unknown) {
        sendErrorToClient(err, client);
    }
};

export const updateMessageInDatabase = async (client: Client, request: ReadMessage): Promise<Message> => {
    const messageId: number = request.messageId;
    const [rows] = await pool.query<Message[] & RowDataPacket[]>(
        'SELECT * FROM messages WHERE id = ?',
        [messageId]
    );
    const updatedMessage: Message = plainToInstance(Message, rows[0], { excludeExtraneousValues: true });
    await validateOrReject(updatedMessage);
    if (updatedMessage.receiverId !== client.userId) {
        throw new Error('You are not the receiver of this message');
    }
    const readTime: Date = new Date();
    await pool.query(
        `UPDATE messages
        SET read_at = ?
        WHERE id = ?`,
        [readTime, messageId]
    );
    updatedMessage.readAt = readTime;
    return updatedMessage;
};
