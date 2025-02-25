import 'reflect-metadata';
import React, { JSX } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ConfigProvider } from '@/components/providers/config-provider';
import { Toaster } from '@/components/ui/toaster';
import { SocketProvider } from '@/components/providers/socket-provider';
import { Messaging } from '@/features/messaging/components/messaging';

export const metadata: Metadata = {
    title: 'Geoff Faiers',
    description: 'The personal portfolio of Geoff Faiers',
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
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className="antialiased">
                <ConfigProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthProvider>
                            <SocketProvider>
                                {children}
                                <Messaging />
                            </SocketProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </ConfigProvider>
                <Toaster />
            </body>
        </html>
    );
}
