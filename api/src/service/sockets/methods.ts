import { ErrorMessage, MessageType, SocketMessage } from '../../models/sockets';
import { Client } from '../../models/sockets/client';
import { clients } from '../../routes/ws';

export const findMatchingClient = (userId?: number, guestSessionId?: string): Client[] => {
    const foundClients: Client[] = [];
    clients.forEach((client: Client) => {
        if (userId && client.userId === userId) {
            foundClients.push(client);
        }
        if (guestSessionId && client.guestSessionId === guestSessionId) {
            foundClients.push(client);
        }
    });
    return foundClients;
};

export const findMatchingClients = (userIds: number[], guestSessionIds: string[]): Client[] => {
    const foundClients: Client[] = [];
    clients.forEach((client: Client) => {
        if (userIds.length > 0 && client.userId != null && userIds.includes(client.userId)) {
            foundClients.push(client);
        }
        if (guestSessionIds.length > 0 && client.guestSessionId != null && guestSessionIds.includes(client.guestSessionId)) {
            foundClients.push(client);
        }
    });
    return foundClients;
};

export const sendMessageToClient = (message: SocketMessage, userId?: number, guestSessionId?: string): void => {
    const toClient: Client[] = findMatchingClient(userId, guestSessionId);
    toClient.forEach((client: Client) => {
        client.ws.send(JSON.stringify(message));
    });
};

export const sendErrorToClient = (error: unknown, client: Client): void => {
    const message: ErrorMessage = {
        type: MessageType.ERROR,
        message: error instanceof Error ? error.message : JSON.stringify(error)
    };
    client.ws.send(JSON.stringify(message));
};
