import React, { JSX } from 'react';
import { Metadata } from 'next';

import { ValidatePage } from './validate-page';

export const metadata: Metadata = {
    title: 'Validate Email',
    description: 'Validate your email account for gfaiers.com'
};

export default function Page(): JSX.Element {
    return (
        <ValidatePage />
    );
}
