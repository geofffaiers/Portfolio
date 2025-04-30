import React, { JSX } from 'react';
import { Metadata } from 'next';

import { PlanningPokerPage } from './planning-poker-page';

export const metadata: Metadata = {
    title: 'Planning Poker',
    description: 'Plan your next sprint with this fun game',
    openGraph: {
        title: 'Planning Poker',
        description: 'Plan your next sprint with this fun game',
        url: '/planning-poker',
        siteName: 'Geoff Faiers',
        images: [
            {
                url: '/images/planning-poker.png',
                width: 1200,
                height: 630,
                alt: 'Planning Poker Game',
            },
        ],
    }
};

export default function Page(): JSX.Element {
    return (
        <PlanningPokerPage />
    );
}
