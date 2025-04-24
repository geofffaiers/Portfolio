'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useSocketContext } from '@/components/providers/socket-provider';
import React, { JSX, useEffect, useMemo } from 'react';
import { useMessagingContext } from '../../context/messaging-provider';
import { Conversations } from './conversations';
import { Loader2 } from 'lucide-react';
import { Chat } from './chat';
import { ChatHeader } from '../../types/chat-header';
import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';

export function PageMessaging(): JSX.Element | null {
    const { user } = useAuthContext();
    const { socket } = useSocketContext();
    const { isMobile } = useDeviceBreakpoints();
    const {
        initialLoading,
        chatHeaders,
        pageChat,
        setPageChat,
        handleCloseFloatingMessaging,
        handleOpenFloatingMessaging
    } = useMessagingContext();

    const openChat = useMemo(
        (): ChatHeader | undefined => chatHeaders.find((chat) => chat.user.id === pageChat?.id),
        [chatHeaders, pageChat]
    );
    useEffect(() => {
        handleCloseFloatingMessaging();
        return () => handleOpenFloatingMessaging();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (user == null || socket == null) {
        return null;
    }

    return (
        <div className='flex items-start w-full'>
            {initialLoading ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <Loader2 className='animate-spin' />;
                </div>
            ) : (
                <>
                    {(!isMobile || openChat == null) && (
                        <Conversations chatHeaders={chatHeaders} openChat={openChat} setPageChat={setPageChat} />
                    )}
                    {(!isMobile || openChat != null) && (
                        <>
                            {openChat == null ? (
                                <div className='flex items-center justify-center w-full h-full'>
                                    <div className='text-center text-muted-foreground'>
                                        Select a conversation to start chatting
                                    </div>
                                </div>
                            ) : (
                                <Chat key={openChat.user.id} chatHeader={openChat} />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
