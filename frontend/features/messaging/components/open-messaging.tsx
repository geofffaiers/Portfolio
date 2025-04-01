'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import React from 'react';
import { useMessagingContext } from '../context/messaging-provider';
import { Button } from '@/components/ui/button';

export const OpenMessaging: React.FC = () => {
    const { user, authLoading } = useAuthContext();
    const { openChats, handleOpenMessaging } = useMessagingContext();

    if (user == null || authLoading || openChats.length > 0) {
        return null;
    }

    return (
        <div>
            <Button
                variant='outline'
                onClick={handleOpenMessaging}
            >
                Open Messaging
            </Button>
        </div>
    );
};
