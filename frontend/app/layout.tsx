import 'reflect-metadata';
import './globals.css';

import React, { JSX } from 'react';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ConfigProvider } from '@/components/providers/config-provider';
import { CookieProvider } from '@/components/providers/cookie-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SocketProvider } from '@/components/providers/socket-provider';
import { Toaster } from '@/components/ui/toaster';
import { Messaging, MessagingProvider } from '@/features/messaging';
import { AppSidebar } from '@/features/nav/app-sidebar';

export const metadata: Metadata = {
    title: 'Geoff Faiers',
    description: 'The personal portfolio of Geoff Faiers',
    metadataBase: new URL('https://gfaiers.com'),
    alternates: {
        canonical: '/',
        languages: {
            'en-GB': '/en-GB',
        },
    },
    openGraph: {
        title: 'Geoff Faiers',
        description: 'The personal portfolio of Geoff Faiers',
        url: 'https://gfaiers.com/',
        siteName: 'Geoff Faiers',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Geoff Faiers Logo',
            },
        ],
        locale: 'en_GB',
        type: 'website',
    }
};

zxcvbnOptions.setOptions({
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    translations: zxcvbnEnPackage.translations
});

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
    const isProd = process.env.NEXT_PUBLIC_NODE_ENV === 'production';
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </head>
            <body className='antialiased'>
                {isProd && gaId != null && <GoogleAnalytics gaId={gaId}/>}
                <ConfigProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <CookieProvider>
                            <AuthProvider>
                                <SocketProvider>
                                    <MessagingProvider>
                                        <SidebarProvider>
                                            <AppSidebar />
                                            {children}
                                        </SidebarProvider>
                                        <Messaging />
                                    </MessagingProvider>
                                </SocketProvider>
                            </AuthProvider>
                        </CookieProvider>
                    </ThemeProvider>
                </ConfigProvider>
                <Toaster />
            </body>
        </html>
    );
}
