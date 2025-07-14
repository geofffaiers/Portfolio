'use client';

import React, { JSX, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/components/providers/auth-provider';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { Account } from './account';
import { ActiveSessions } from './active-sessions';
import { ChangePassword } from './change-password';
import { DeleteAccount } from './delete-account';

export default function AccountPage(): JSX.Element {
    const { authLoading, user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user == null) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    return (
        <SidebarInset>
            <header className='flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4'>
                <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator orientation='vertical' className='mr-2 h-4' />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className='hidden md:block'>
                                <BreadcrumbLink asChild>
                                    <Link href='/'>
                                        Home
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className='hidden md:block' />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Account</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <ThemeToggle />
            </header>
            <div className='flex flex-col gap-4 p-4 max-w-[100vw]'>
                <Typography variant='h1'>Your account</Typography>
                <div className='flex flex-col md:flex-row gap-4'>
                    <Card className='flex-1 w-full'>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-4'>
                            <Account/>
                            <ChangePassword/>
                            <DeleteAccount/>
                        </CardContent>
                    </Card>
                    <ActiveSessions/>
                </div>
            </div>
        </SidebarInset>
    );
}
