import { WebSocket } from 'ws';

export interface Client {
  clientId: string;
  ws: WebSocket;
  userId?: number;
  guestSessionId?: string;
}
