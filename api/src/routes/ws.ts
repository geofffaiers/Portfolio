import { WebSocket, Server as WebSocketServer } from 'ws'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { Client } from '../models/sockets/Client'
import { SocketMessage, MessageType } from '../models/sockets'
import { newMessageHandler, readMessageHandler } from '../service/sockets/messaging'
import { authenticateTokenForSocket } from '../middlewares'

export const clients: Map<string, Client> = new Map()

export const handleWebSocketConnection = (wss: WebSocketServer) => {
  wss.on('connection', async (ws: WebSocket, req: Request) => {
    const clientId: string = uuid()
    try {
      const userId: number = await authenticateTokenForSocket(ws, req)
      const client: Client = { clientId, ws, userId }
      clients.set(clientId, client)
      console.log(`New WebSocket connection: ${clientId}`, userId)
      ws.on('message', (msg: Buffer) => {
        try {
          const message: SocketMessage = JSON.parse(msg.toString())
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

interface MessageRoute {
  type: MessageType
  fn: (client: Client, message: SocketMessage) => void
}

const messageRouter: MessageRoute[] = [
  {
    type: MessageType.NEW_MESSAGE,
    fn: newMessageHandler
  },
  {
    type: MessageType.READ_MESSAGE,
    fn: readMessageHandler
  }
]
