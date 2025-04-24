'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, User } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHeader } from '../types/chat-header';
import { Messaging } from '../types/messaging.types';

export function useMessaging(): Messaging {
    const { config } = useConfigContext();
    const { authReady } = useAuthContext();
    const { displayError } = useToastWrapper();
    const [chatHeaders, setChatHeaders] = useState<ChatHeader[]>([]);
    const [floatingOpen, setFloatingOpen] = useState<boolean>(true);
    const [openChats, setOpenChats] = useState<User[]>([]);
    const [pageChat, setPageChat] = useState<User | null>(null);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const initialLoadRef = useRef<boolean>(true);

    const getConversations = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/messaging/get-chat-headers`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const json: DefaultResponse<ChatHeader[]> = await response.json();
            if (json.success) {
                setChatHeaders(json.data);
                if (json.data.length === 1) {
                    setOpenChats([]);
                    setPageChat(json.data[0].user);
                }
            } else {
                displayError(json.message ?? 'Failed to get conversations');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
            if (initialLoading) {
                setInitialLoading(false);
            }
        }
    }, [config.apiUrl, displayError, initialLoading]);

    useEffect(() => {
        if (initialLoadRef.current && authReady && config.apiUrl != null) {
            initialLoadRef.current = false;
            getConversations();
        }
    }, [authReady, config.apiUrl, displayError, getConversations]);

    const handleOpenChat = useCallback((user: User): void => {
        setOpenChats((chats) => {
            if (chats.find((u: User) => u.id === user.id)) {
                return chats;
            }
            return [...chats, user];
        });
    }, []);

    const handleCloseChat = useCallback((user: User): void => {
        const closedChats = openChats.filter((u) => u.id !== user.id);
        setOpenChats(closedChats);
        if (closedChats.length === 0) {
            setFloatingOpen(false);
        }
    }, [openChats]);

    const handleOpenFloatingMessaging = useCallback((): void => {
        setFloatingOpen(true);
        if (pageChat != null) {
            handleOpenChat(pageChat);
        } else if (chatHeaders.length === 1) {
            handleOpenChat(chatHeaders[0].user);
        } else if (chatHeaders.length === 0) {
            getConversations();
        }
    }, [pageChat, chatHeaders, handleOpenChat, getConversations]);

    const handleCloseFloatingMessaging = useCallback((): void => {
        setFloatingOpen(false);
        openChats.forEach((u) => handleCloseChat(u));
    }, [openChats, handleCloseChat]);

    return {
        floatingOpen,
        initialLoading,
        loading,
        chatHeaders,
        openChats,
        pageChat,
        displayConversations: chatHeaders.length > 1,
        setPageChat,
        handleOpenChat,
        handleCloseChat,
        handleOpenFloatingMessaging,
        handleCloseFloatingMessaging
    };
}
