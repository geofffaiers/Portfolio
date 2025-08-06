import { WebSocket, Server as WebSocketServer } from 'ws';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Client } from '../models/sockets/client';
import { socketAuthentication } from '../middlewares';
import { logError, pool } from '../helpers';
import { ResultSetHeader } from 'mysql2';
import { getUser } from '../service/users/methods';
import { sendMessageToClient } from '../service/sockets/methods';
import { User } from '../models';
import { newMessageHandler, readMessageHandler } from '../service/messaging';
import { submitScoreHandler } from '../service/planning-poker';
import { MessageType, SocketMessage, UpdatedProfile } from '../models/sockets';

export const clients: Map<string, Client> = new Map();

export const handleWebSocketConnection = (wss: WebSocketServer): void => {
    wss.on('connection', (ws: WebSocket, req: Request) => {
        const clientId: string = uuid();
        const client: Client = { clientId, ws, userId: -1 };
        try {
            socketAuthentication(ws, req)
                .then(async ([userId, guestSessionId]) => {
                    if (userId != null) {
                        client.userId = userId;
                        clients.set(clientId, client);
                        await setUserActive(userId, true);
                        const user: User = await getUser(userId);
                        user.password = '';
                        const message: UpdatedProfile = {
                            type: MessageType.UPDATED_PROFILE,
                            user
                        };
                        sendMessageToClient(message, userId);
                    } else if (guestSessionId != null) {
                        client.guestSessionId = guestSessionId;
                        clients.set(clientId, client);
                    } else {
                        ws.close(1008, 'Unauthorized');
                        return;
                    }
                })
                .catch((err: unknown) => {
                    logError(err);
                    if (err instanceof Error) {
                        ws.close(1008, err.message);
                    } else {
                        ws.close(1008, 'An unexpected error occurred');
                    }
                });
            ws.on('message', (msg: Buffer) => {
                try {
                    const message: SocketMessage = JSON.parse(msg.toString());
                    const route: MessageRoute | undefined = messageRouter.find((route: MessageRoute) => route.type === message.type);
                    if (route != null) {
                        route.fn(client, message)
                            .catch((err: unknown) => {
                                logError(err);
                            });
                        return;
                    }
                    logError(new Error(`No route found for message: ${JSON.stringify(message)}`));
                } catch (err: unknown) {
                    logError(err);
                }
            });
            ws.on('close', () => {
                clients.delete(clientId);
                if (client.userId != null && client.userId !== -1) {
                    setUserActive(client.userId, false)
                        .catch((err: unknown) => {
                            logError(new Error(`Error setting user inactive: ${JSON.stringify(err)}`));
                        });
                }
            });
        } catch (err: unknown) {
            const client: Client | undefined = clients.get(clientId);
            if (client != null) {
                clients.delete(clientId);
                if (client.userId != null) {
                    setUserActive(client.userId, false)
                        .catch((err: unknown) => {
                            logError(`Error setting user inactive: ${JSON.stringify(err)}`);
                        });
                }
            }
            const error: string = err instanceof Error ? err.message : JSON.stringify(err);
            ws.close(1002, error);
        }
    });
};

const setUserActive = async (userId: number, active: boolean): Promise<void> => {
    await pool.query<ResultSetHeader>(
        'UPDATE users SET active = ? WHERE id = ?',
        [active, userId]
    );
};

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
    },
    {
        type: MessageType.SUBMIT_SCORE,
        fn: submitScoreHandler
    }
];
