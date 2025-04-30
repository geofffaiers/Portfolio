'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import React from 'react';
import { useMessagingContext } from '../context/messaging-provider';
import { Button } from '@/components/ui/button';
import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';

export const OpenMessaging: React.FC = () => {
    const { user, authLoading } = useAuthContext();
    const { isMobile } = useDeviceBreakpoints();
    const { floatingOpen, openChats, handleOpenFloatingMessaging } = useMessagingContext();

    if (isMobile || user == null || authLoading || (floatingOpen || openChats.length > 0)) {
        return null;
    }

    return (
        <div>
            <Button
                variant='outline'
                onClick={handleOpenFloatingMessaging}
            >
                Open Messaging
            </Button>
        </div>
    );
};
