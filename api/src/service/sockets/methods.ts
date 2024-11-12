import { Client, ErrorMessage, MessageType, SocketMessage } from "../../models"
import { clients } from "../../routes/ws"

export const findMatchingClientUserId = (userId: number): Client[] => {
  const foundClients: Client[] = []
  clients.forEach((client: Client) => {
    if (client.userId === userId) {
      foundClients.push(client)
    }
  })
  return foundClients
}

export const sendMessageToClient = (message: SocketMessage, to: number): void => {
  const toClient: Client[] = findMatchingClientUserId(to)
  toClient.forEach((client: Client) => {
    client.ws.send(JSON.stringify(message))
  })
}

export const sendErrorToClient = (error: Error, client: Client): void => {
  const message: ErrorMessage = {
    type: MessageType.ERROR,
    message: error.message
  }
  client.ws.send(JSON.stringify(message))
}