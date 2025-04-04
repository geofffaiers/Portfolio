import { ErrorMessage, MessageType, SocketMessage } from '../../models/sockets';
import { Client } from '../../models/sockets/client';
import { clients } from '../../routes/ws';

export const findMatchingClientUserId = (userId: number): Client[] => {
    const foundClients: Client[] = [];
    clients.forEach((client: Client) => {
        if (client.userId === userId) {
            foundClients.push(client);
        }
    });
    return foundClients;
};

export const findMatchingClientsForUserIds = (userIds: number[]): Client[] => {
    const foundClients: Client[] = [];
    clients.forEach((client: Client) => {
        if (userIds.includes(client.userId)) {
            foundClients.push(client);
        }
    });
    return foundClients;
};

export const sendMessageToClient = (message: SocketMessage, to: number): void => {
    const toClient: Client[] = findMatchingClientUserId(to);
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
