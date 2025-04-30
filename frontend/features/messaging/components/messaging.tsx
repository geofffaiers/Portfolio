import React, { ReactElement } from 'react';
import { MessagingType } from '../types/messaging.types';
import { FloatingMessaging } from './floating/floating-messaging';
import { PageMessaging } from './page/page-messaging';

export function Messaging({ type = 'floating' }: { type?: MessagingType }): ReactElement | null {
    return type === 'page' ? (
        <PageMessaging />
    ) : (
        <FloatingMessaging />
    );
}
