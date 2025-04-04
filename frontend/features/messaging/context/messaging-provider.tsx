'use client';

import React, { createContext, useContext } from 'react';
import { useMessaging } from '../hooks/use-messaging';
import { Messaging } from '../types/messaging.type';



const MessagingContext = createContext<Messaging | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
    const messagingState = useMessaging();

    return (
        <MessagingContext.Provider value={messagingState}>
            {children}
        </MessagingContext.Provider>
    );
}

export function useMessagingContext() {
    const context = useContext(MessagingContext);

    if (context === undefined) {
        throw new Error('useMessagingContext must be used within a MessagingProvider');
    }

    return context;
}
