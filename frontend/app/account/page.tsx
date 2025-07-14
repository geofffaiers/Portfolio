import React, { JSX } from 'react';
import { Metadata } from 'next';

import AccountPage from './account-page';

export const metadata: Metadata = {
    title: 'Account',
    description: 'Manage your account for gfaiers.com'
};

export default function Page(): JSX.Element {
    return (
        <AccountPage />
    );
}
