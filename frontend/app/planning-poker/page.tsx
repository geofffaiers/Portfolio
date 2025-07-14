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
                url: '/logos/planning-poker.png',
                width: 1024,
                height: 1024,
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
