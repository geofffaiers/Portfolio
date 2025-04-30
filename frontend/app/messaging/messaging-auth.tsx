import React from 'react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { AccessRestricted } from '@/components/ui/access-restricted';
import { Messaging } from '@/features/messaging';
import { Loader2 } from 'lucide-react';

export const MessagingAuth: React.FC = () => {
    const { authLoading, authReady } = useAuthContext();
    return (
        <>
            {authLoading && <Loader2 className='animate-spin' />}
            {authReady
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
