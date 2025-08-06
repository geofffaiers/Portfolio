import React from 'react';
import { Loader2 } from 'lucide-react';

import { useAuthContext } from '@/components/providers/auth-provider';
import { AccessRestricted } from '@/components/ui/access-restricted';
import { Messaging } from '@/features/messaging';

export const MessagingAuth: React.FC = () => {
    const { authLoading, userReady } = useAuthContext();
    return (
        <>
            {authLoading && <Loader2 className='animate-spin' />}
            {userReady
                ? (
                    <Messaging type='page' />
                )
                : (
                    <AccessRestricted message='To use Messaging, please sign in or register.'/>
                )
            }
        </>
    );
};
