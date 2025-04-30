import React, { JSX } from 'react';
import { Metadata } from 'next';

import { ResetPasswordPage } from './reset-password-page';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your password for gfaiers.com'
};

export default function Page(): JSX.Element {
    return (
        <ResetPasswordPage />
    );
}
