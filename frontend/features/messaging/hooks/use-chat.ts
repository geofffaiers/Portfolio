'use client';

import 'reflect-metadata';
import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import { Message } from '../types/message';
import { useConfigContext } from '@/components/providers/config-provider';
import { BaseMessage, DefaultResponse, MessageType, NewMessage, ReadMessage, User } from '@/models';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { useAuthContext } from '@/components/providers/auth-provider';
import { ChatHeader } from '../types/chat-header';
import { useSocketContext } from '@/components/providers/socket-provider';
import { UpdatedMessage } from '@/models/sockets/messaging/updated-message';

type UseChat = {
    newMessage: string
    setNewMessage: (newMessage: string) => void
    messages: Message[]
    loading: boolean
    hasMore: boolean
    sendMessage: () => void
    readMessage: (messageId: number) => void
    loadMoreMessages: () => void
    minimized: boolean
    setMinimized: (minimized: boolean) => void
    getSender: (userId: number) => User | null
    messagesEndRef: RefObject<HTMLDivElement | null>
}

type Props = {
    chatHeader: ChatHeader
}

export function useChat({ chatHeader }: Props): UseChat {
    const { userReady, user } = useAuthContext();
    const { config } = useConfigContext();
    // TODO: Still need to implement unsubscribe
    const { sendSocketMessage, subscribe, unsubscribe: _unsubscribe } = useSocketContext();
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [minimized, setMinimized] = useState<boolean>(false);
    const isFirstRender = useRef<boolean>(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialLoadRef = useRef<boolean>(true);
    const loadMore = useRef<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const scrollToBottom = useRef<boolean>(false);
    const userId = chatHeader.user.id;

    const addError = useCallback((message: string) => {
        setMessages((prev) => [...prev, {
            id: -1,
            content: message,
            senderId: -1,
            receiverId: -1,
            createdAt: new Date(),
            isError: true,
        }]);
    }, []);

    const messageForThisChat = useCallback((message: Message): boolean => {
        const userIds = [user?.id, chatHeader.user.id];
        return userIds.includes(message.senderId) && userIds.includes(message.receiverId);
    }, [user?.id, chatHeader.user.id]);

    const handleMessages = useCallback((newMessages: Message[]): void => {
        setMessages((messages: Message[]): Message[] => {
            const previous: Message[] = structuredClone(messages);
            scrollToBottom.current = newMessages.length === 1 && newMessages[0].id > messages[messages.length - 1]?.id;
            newMessages.forEach((newMessage: Message) => {
                const index = previous.findIndex((msg: Message) => msg.id === newMessage.id);
                if (index !== -1) {
                    previous[index] = newMessage;
                } else {
                    previous.push(newMessage);
                }
            });
            previous.sort((a: Message, b: Message) => a.id - b.id);
            return previous;
        });
    }, []);

    const handleSocketMessage = useCallback(async (socketMessage: BaseMessage) => {
        try {
            let message: Message;

            if (socketMessage.type === MessageType.NEW_MESSAGE) {
                const newMessage: NewMessage = plainToInstance(NewMessage, socketMessage, { excludeExtraneousValues: true });
                await validateOrReject(newMessage);
                message = plainToInstance(Message, newMessage.message, { excludeExtraneousValues: true });
            } else if (socketMessage.type === MessageType.UPDATED_MESSAGE) {
                const updatedMessage: UpdatedMessage = plainToInstance(UpdatedMessage, socketMessage, { excludeExtraneousValues: true });
                await validateOrReject(updatedMessage);
                message = plainToInstance(Message, updatedMessage.message, { excludeExtraneousValues: true });
            } else {
                throw new Error('Unsupported message type');
            }
            await validateOrReject(message);
            if (messageForThisChat(message)) {
                handleMessages([message]);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                addError(err.message);
            } else {
                addError('An unknown error occurred');
            }
        }
    }, [addError, messageForThisChat, handleMessages]);

    const getSender = useCallback((sender: number): User | null => {
        if (sender === user?.id) {
            return user;
        } else if (sender === chatHeader.user.id) {
            return chatHeader.user;
        } else {
            return null;
        }
    }, [chatHeader, user]);

    const getMessagesForPage = useCallback(async () => {
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/messaging/get-messages-for-page?userId=${userId}&page=${page}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            });
            const json: DefaultResponse<Message[]> = await response.json();
            if (json.success) {
                const msgs: Message[] = await Promise.all(json.data.map(async (msg: Message) => {
                    const m: Message = plainToInstance(Message, msg, { excludeExtraneousValues: true });
                    await validateOrReject(m);
                    return m;
                }));
                handleMessages(msgs);
                setHasMore(msgs.length === 20);
            } else {
                addError(json.message ?? 'Failed to fetch messages');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                addError(err.message);
            } else {
                addError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, userId, page, handleMessages, addError]);

    useEffect(() => {
        if (initialLoadRef.current && userReady) {
            initialLoadRef.current = false;
            getMessagesForPage();
            subscribe(MessageType.NEW_MESSAGE, handleSocketMessage);
            subscribe(MessageType.UPDATED_MESSAGE, handleSocketMessage);
        }
    }, [getMessagesForPage, handleSocketMessage, subscribe, userReady]);

    useEffect(() => {
        if (loadMore.current) {
            loadMore.current = false;
            getMessagesForPage();
        }
    }, [getMessagesForPage]);

    useEffect(() => {
        if (isFirstRender.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
            isFirstRender.current = false;
        } else if (scrollToBottom.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            scrollToBottom.current = false;
        }
    }, [messages]);

    const sendMessage = useCallback(async () => {
        if (newMessage.trim() === '') {
            return;
        }
        const message: Message = new Message();
        message.content = newMessage.trim();
        message.senderId = user?.id ?? -1;
        message.receiverId = userId;
        const socketMessage: NewMessage = new NewMessage(message);
        sendSocketMessage(socketMessage);
        setNewMessage('');
    }, [newMessage, user?.id, userId, sendSocketMessage]);

    const readMessage = useCallback(async (messageId: number) => {
        const socketMessage: ReadMessage = new ReadMessage();
        socketMessage.messageId = messageId;
        sendSocketMessage(socketMessage);
    }, [sendSocketMessage]);

    const loadMoreMessages = useCallback(() => {
        if (hasMore && !loading) {
            loadMore.current = true;
            setPage((prev) => prev + 1);
        }
    }, [hasMore, loading]);

    return {
        newMessage,
        setNewMessage,
        messages,
        loading,
        hasMore,
        sendMessage,
        readMessage,
        loadMoreMessages,
        minimized,
        setMinimized,
        getSender,
        messagesEndRef,
    };
}
