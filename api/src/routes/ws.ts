import { WebSocket, Server as WebSocketServer } from 'ws'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { Client } from '../models/sockets/Client'
import { Message, MessageType } from '../models/sockets'
import { messageReceivedHandler } from '../service/sockets/messaging'

export const clients: Map<string, Client> = new Map()

export const handleWebSocketConnection = (wss: WebSocketServer) => {
  wss.on('connection', (ws: WebSocket, req: Request) => {
    const clientId: string = uuid()
    try {
      const userId: number = extractUserId(req)
      const client: Client = { clientId, ws, userId }
      clients.set(clientId, client)
      console.log(`New WebSocket connection: ${clientId}`, userId)
      ws.on('message', (msg: Buffer) => {
        try {
          const message: Message = JSON.parse(msg.toString())
          console.log('Received message:', message)
          const route: MessageRoute | undefined = messageRouter.find((route: MessageRoute) => route.type === message.type)
          if (route != null) {
            route.fn(client, message)
            return
          }
          console.error('No route found for message:', message)
        } catch (err: any) {
          console.error('Error parsing message:', err)
        }
      })
      ws.on('close', () => {
        console.log('WebSocket connection closed')
        clients.delete(clientId)
      })
    } catch (err: any) {
      const client: Client | undefined = clients.get(clientId)
      if (client != null) {
        clients.delete(clientId)
      }
      ws.close(1002, err.message)
    }
  })
}

const extractUserId = (req: Request): number => {
  const userId: string | string[] | undefined = req.headers['user-id'] || req.headers['User-Id']
  if (!userId) {
    throw new Error('User ID header is missing')
  }
  const userIdInt: number = parseInt(userId as string, 10)
  if (isNaN(userIdInt)) {
    throw new Error('Invalid User ID')
  }
  return userIdInt
}

interface MessageRoute {
  type: MessageType
  fn: (client: Client, message: Message) => void
}

const messageRouter: MessageRoute[] = [
  {
    type: MessageType.MESSAGE_RECEIVED,
    fn: messageReceivedHandler
  }
]
