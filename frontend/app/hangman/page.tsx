import React, { JSX } from 'react';
import { Metadata } from 'next';

import { HangmanPage } from './hangman-page';

export const metadata: Metadata = {
    title: 'Hangman',
    description: 'See if you can save the hanging man with your word wizardry'
};

export default function Page(): JSX.Element {
    return (
        <HangmanPage />
    );
}
