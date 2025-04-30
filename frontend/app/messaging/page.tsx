import React, { JSX } from 'react';

import { MessagingPage } from './messaging-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Messaging',
    description: 'Messaging for gfaiers.com'
};

export default function Page(): JSX.Element {
    return (
        <MessagingPage />
    );
}
