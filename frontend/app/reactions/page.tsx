import React, { JSX } from 'react';
import { Metadata } from 'next';

import { ReactionsPage } from './reactions-page';

export const metadata: Metadata = {
    title: 'Reactions',
    description: 'Test your reaction speed with this fun game',
    openGraph: {
        title: 'Reactions',
        description: 'Test your reaction speed with this fun game',
        url: '/reactions',
        siteName: 'Geoff Faiers',
        images: [
            {
                url: '/images/reactions.png',
                width: 1200,
                height: 630,
                alt: 'Reactions Game',
            },
        ],
    }
};

export default function Page(): JSX.Element {
    return (
        <ReactionsPage />
    );
}
