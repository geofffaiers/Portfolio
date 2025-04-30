import React, { JSX } from 'react';
import { Metadata } from 'next';

import { HireMePage } from './hire-me-page';

export const metadata: Metadata = {
    title: 'Geoff Faiers',
    description: 'Portfolio of Geoff Faiers',
    openGraph: {
        title: 'Geoff Faiers',
        description: 'Portfolio of Geoff Faiers',
        url: '/hire-me',
        siteName: 'Geoff Faiers',
    }
};

export default function Page(): JSX.Element {
    return (
        <HireMePage />
    );
}
