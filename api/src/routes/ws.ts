import { WebSocket, Server as WebSocketServer } from 'ws'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { Client } from '../models/sockets/Client'
import { SocketMessage, MessageType } from '../models/sockets'
import { newMessageHandler, readMessageHandler } from '../service/sockets/messaging'
import { authenticateTokenForSocket } from '../middlewares'
import { pool } from '../helpers'
import { ResultSetHeader } from 'mysql2'

export const clients: Map<string, Client> = new Map()

export const handleWebSocketConnection = (wss: WebSocketServer): void => {
  wss.on('connection', (ws: WebSocket, req: Request) => {
    const clientId: string = uuid()
    const client: Client = { clientId, ws, userId: -1 }
    try {
      authenticateTokenForSocket(ws, req)
        .then((userId: number) => {
          client.userId = userId
          clients.set(clientId, client)
          console.log(`New WebSocket connection: ${clientId}`, userId)
          setUserActive(userId, true)
            .catch((err: any) => {
              console.error('Error setting user active:', err)
            })
        })
        .catch((err: any) => {
          ws.close(1008, err.message)
        })
      ws.on('message', (msg: Buffer) => {
        try {
          const message: SocketMessage = JSON.parse(msg.toString())
          const route: MessageRoute | undefined = messageRouter.find((route: MessageRoute) => route.type === message.type)
          if (route != null) {
            route.fn(client, message)
              .catch((err: any) => {
                console.error('Error handling message:', err)
              })
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
        setUserActive(client.userId, false)
          .catch((err: any) => {
            console.error('Error setting user inactive:', err)
          })
      })
    } catch (err: any) {
      const client: Client | undefined = clients.get(clientId)
      if (client != null) {
        clients.delete(clientId)
        setUserActive(client.userId, false)
          .catch((err: any) => {
            console.error('Error setting user inactive:', err)
          })
      }
      ws.close(1002, err.message)
    }
  })
}

const setUserActive = async (userId: number, active: boolean): Promise<void> => {
  await pool.query<ResultSetHeader>(
    'UPDATE users SET active = ? WHERE id = ?',
    [active, userId]
  )
}

interface MessageRoute {
  type: MessageType
  fn: (client: Client, message: SocketMessage) => Promise<void>
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
