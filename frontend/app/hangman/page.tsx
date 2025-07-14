import React, { JSX } from 'react';
import { Metadata } from 'next';

import { HangmanPage } from './hangman-page';

export const metadata: Metadata = {
    title: 'Hangman',
    description: 'See if you can save the hanging man with your word wizardry',
    openGraph: {
        title: 'Hangman',
        description: 'See if you can save the hanging man with your word wizardry',
        url: '/hangman',
        siteName: 'Geoff Faiers',
        images: [
            {
                url: '/logos/hangman.png',
                width: 1024,
                height: 1024,
                alt: 'Hangman',
            },
        ],
    }
};

export default function Page(): JSX.Element {
    return (
        <HangmanPage />
    );
}
