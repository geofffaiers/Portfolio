'use client';

import React, { JSX } from 'react';
import { AppSidebar } from '@/features/nav/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Account } from './account';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChangePassword } from './change-password';
import { DeleteAccount } from './delete-account';
import Link from 'next/link';

export default function Page(): JSX.Element {
    const { authLoading, user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user == null) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    return (
        <SidebarProvider>
            <AppSidebar />
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
                </header>
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <h1 className='text-4xl font-bold'>Your account</h1>
                    <Account />
                    <ChangePassword />
                    <DeleteAccount />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
