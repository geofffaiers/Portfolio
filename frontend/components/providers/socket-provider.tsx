'use client';

import 'reflect-metadata';
import React, { createContext, useEffect, useRef, useContext, useCallback } from 'react';
import { useConfigContext } from './config-provider';
import { useAuthContext } from './auth-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { BaseMessage, ErrorMessage, MessageType, UpdatedProfile } from '@/models';
import { plainToInstance } from 'class-transformer';

type SocketContextProps = {
  socket: WebSocket | null
  sendSocketMessage: (data: BaseMessage) => void
  subscribe: (type: string, handler: (msg: BaseMessage) => void | Promise<void>) => number
  unsubscribe: (id: number) => void
}

type Subscription = {
  id: number
  type: string
  handler: (msg: BaseMessage) => void | Promise<void>
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    sendSocketMessage: () => {},
    subscribe: () => -1,
    unsubscribe: () => {}
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, setUser, authLoading } = useAuthContext();
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const socketRef = useRef<WebSocket | null>(null);
    const handlersRef = useRef<Array<Subscription>>([]);
    const subscriptionNextIdRef = useRef<number>(0);
    const prevUserIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!config.wsUrl) return;
        if (authLoading || user == null) {
            socketRef.current?.close();
            return;
        }
        if (user.id === prevUserIdRef.current) return;
        prevUserIdRef.current = user.id;
        let wsUrl = config.wsUrl;
        if (wsUrl.startsWith('/') && window.location.hostname !== 'localhost') {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl = `${protocol}//${window.location.host}${wsUrl}`;
        }

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            // eslint-disable-next-line no-console
            console.log('Connected to WebSocket at', wsUrl, new Date());
        };

        socketRef.current.onclose = () => {
            prevUserIdRef.current = null;
            // eslint-disable-next-line no-console
            console.log('Disconnected', new Date());
        };
        socketRef.current.onerror = (err) => {
            displayError(`WebSocket error: ${err}`);
            // eslint-disable-next-line no-console
            console.error('WebSocket error:', err);
        };
        socketRef.current.onmessage = (event) => {
            const message: BaseMessage = JSON.parse(event.data);
            if (message.type === MessageType.ERROR) {
                const errorRequest: ErrorMessage = plainToInstance(ErrorMessage, message, { excludeExtraneousValues: true });
                displayError(errorRequest.message);
            }
            if (message.type === MessageType.UPDATED_PROFILE) {
                const profileUpdatedRequest: UpdatedProfile = plainToInstance(UpdatedProfile, message, { excludeExtraneousValues: true });
                setUser(profileUpdatedRequest.user);
            }
            if (message.type === MessageType.DELETE_PROFILE) {
                setUser(null);
            }
            handlersRef.current.forEach(async (sub) => {
                if (sub.type === message.type) {
                    await sub.handler(message);
                }
            });
        };
        return () => {
            if (socketRef.current != null && (user == null || user.id !== prevUserIdRef.current)) {
                socketRef.current.close();
            }
        };
    }, [authLoading, user, setUser, displayError, config.wsUrl]);

    const sendSocketMessage = useCallback((data: BaseMessage) => {
        if (socketRef.current) {
            socketRef.current.send(JSON.stringify(data));
        }
    }, []);

    const subscribe = useCallback((type: string, handler: (msg: BaseMessage) => void | Promise<void>): number => {
        const id = subscriptionNextIdRef.current;
        subscriptionNextIdRef.current += 1;
        handlersRef.current.push({ id, type, handler } satisfies Subscription);
        return id;
    }, []);

    const unsubscribe = useCallback((id: number) => {
        handlersRef.current = handlersRef.current.filter(sub => sub.id !== id);
    }, []);

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            sendSocketMessage,
            subscribe,
            unsubscribe
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};
