import React, { JSX } from 'react';
import { Metadata } from 'next';

import { LoginPage } from './login-page';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account',
    openGraph: {
        title: 'Login',
        description: 'Login to your account',
        url: '/login',
        siteName: 'Geoff Faiers'
    }
};

export default function Page(): JSX.Element {
    return (
        <LoginPage />
    );
}
