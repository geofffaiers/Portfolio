'use client';

import { Conversations } from './conversations';
import { Chat } from './chat';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useSocketContext } from '@/components/providers/socket-provider';
import React, { JSX } from 'react';
import { useMessagingContext } from '../../context/messaging-provider';
import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';

export function FloatingMessaging(): JSX.Element | null {
    const { user } = useAuthContext();
    const { socket } = useSocketContext();
    const { isMobile } = useDeviceBreakpoints();
    const {
        loading,
        chatHeaders,
        openChats,
        displayConversations,
        handleOpenChat,
        handleCloseChat,
        floatingOpen,
        handleCloseFloatingMessaging
    } = useMessagingContext();

    if (isMobile || user == null || socket == null || !floatingOpen) {
        return null;
    }

    return (
        <div className='fixed bottom-0 right-4 flex items-end'>
            {!loading && (
                <>
                    {chatHeaders.map((header) => {
                        const chatOpen: boolean = openChats.some(u => u.id === header.user.id);
                        if (!chatOpen) return null;
                        return (
                            <div key={header.user.id} className={`flex flex-col h-full justify-end ${displayConversations ? 'mr-4' : ''}`}>
                                <Chat chatHeader={header} handleCloseChat={handleCloseChat} allowClose={true}/>
                            </div>
                        );
                    })}
                </>
            )}
            <div className='flex flex-col h-full justify-end'>
                <Conversations
                    chatHeaders={chatHeaders}
                    displayConversations={displayConversations}
                    handleOpenChat={handleOpenChat}
                    handleCloseFloatingMessaging={handleCloseFloatingMessaging}
                />
            </div>
        </div>
    );
}
