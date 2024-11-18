import { plainToInstance } from 'class-transformer'
import { Message } from '../../models/Message'
import { Client, MessageType, NewMessage, SocketMessage, UpdatedMessage } from '../../models/sockets'
import { findMatchingClientUserId, sendErrorToClient } from './methods'
import { pool } from '../../helpers'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { validateOrReject } from 'class-validator'
import { ReadMessage } from '../../models/sockets/ReadMessage'

export const newMessageHandler = async (client: Client, message: SocketMessage): Promise<void> => {
  try {
    const request: NewMessage = plainToInstance(NewMessage, message, { excludeExtraneousValues: true })
    const toMessage: Message = await saveMessageToDatabase(client, request)
    const response: NewMessage = {
      type: MessageType.NEW_MESSAGE,
      message: toMessage
    }
    sendMessageToClient(response, toMessage.receiverId)
    sendMessageToClient(response, toMessage.senderId)
  } catch (err: any) {
    sendErrorToClient(err, client)
  }
}

export const readMessageHandler = async (client: Client, message: SocketMessage): Promise<void> => {
  try {
    const request: ReadMessage = plainToInstance(ReadMessage, message, { excludeExtraneousValues: true })
    const toMessage: Message = await updateMessageInDatabase(client, request)
    const response: UpdatedMessage = {
      type: MessageType.UPDATED_MESSAGE,
      message: toMessage
    }
    sendMessageToClient(response, toMessage.receiverId)
    sendMessageToClient(response, toMessage.senderId)
  } catch (err: any) {
    sendErrorToClient(err, client)
  }
}

const saveMessageToDatabase = async (client: Client, request: NewMessage): Promise<Message> => {
  const message: Message = request.message
  if (message.senderId !== client.userId) {
    throw new Error('You are not the sender of this message')
  }
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES (?, ?, ?)`,
    [message.senderId, message.receiverId, message.content]
  )
  const [rows] = await pool.query<Message[] & RowDataPacket[]>(
    'SELECT * FROM messages WHERE id = ?',
    [result.insertId]
  )
  const savedMessage: Message = plainToInstance(Message, rows[0], { excludeExtraneousValues: true })
  await validateOrReject(savedMessage)
  return savedMessage
}

const updateMessageInDatabase = async (client: Client, request: ReadMessage): Promise<Message> => {
  const messageId: number = request.messageId
  const [rows] = await pool.query<Message[] & RowDataPacket[]>(
    'SELECT * FROM messages WHERE id = ?',
    [messageId]
  )
  const updatedMessage: Message = plainToInstance(Message, rows[0], { excludeExtraneousValues: true })
  await validateOrReject(updatedMessage)
  if (updatedMessage.receiverId !== client.userId) {
    throw new Error('You are not the receiver of this message')
  }
  const readTime: Date = new Date()
  await pool.query(
    `UPDATE messages
     SET read_at = ?
     WHERE id = ?`,
    [readTime, messageId]
  )
  updatedMessage.readAt = readTime
  return updatedMessage
}

const sendMessageToClient = (message: SocketMessage, to: number): void => {
  const toClient: Client[] = findMatchingClientUserId(to)
  toClient.forEach((client: Client) => {
    client.ws.send(JSON.stringify(message))
  })
}
