'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, User } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHeader } from '../types/chat-header';

type UseMessaging = {
  loading: boolean
  chatHeaders: ChatHeader[]
  openChats: User[]
  displayConversations: boolean
  handleOpenChat: (user: User) => void
  handleCloseChat: (user: User) => void
}

export function useMessaging(): UseMessaging {
    const { config } = useConfigContext();
    const { user } = useAuthContext();
    const { displayError } = useToastWrapper();
    const [chatHeaders, setChatHeaders] = useState<ChatHeader[]>([]);
    const [openChats, setOpenChats] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const initialLoadRef = useRef<boolean>(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const getConversations = useCallback(async (): Promise<void> => {
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/messaging/get-chat-headers`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal
            });
            const json: DefaultResponse<ChatHeader[]> = await response.json();
            if (json.success) {
                setChatHeaders(json.data);
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
        }
    }, [config.apiUrl, displayError]);

    useEffect(() => {

        if (initialLoadRef.current && user != null && config.apiUrl != null) {
            initialLoadRef.current = false;
            getConversations();
        }

        return () => {
            if (abortControllerRef.current != null) {
                abortControllerRef.current.abort('Component unmounted');
            }
        };
    }, [user, config.apiUrl, displayError, getConversations]);

    const handleOpenChat = useCallback((user: User): void => {
        setOpenChats((chats) => {
            if (chats.find((u: User) => u.id === user.id)) {
                return chats;
            }
            return [...chats, user];
        });
    }, []);

    const handleCloseChat = useCallback((user: User): void => {
        setOpenChats((chats) => chats.filter((u) => u.id !== user.id));
    }, []);

    return {
        loading,
        chatHeaders,
        openChats,
        displayConversations: chatHeaders.length > 1,
        handleOpenChat,
        handleCloseChat,
    };
}
