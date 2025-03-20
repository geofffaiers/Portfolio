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
import { useParams } from 'next/navigation';
import { ResetPassword } from './reset-password';
import Link from 'next/link';

export default function Page(): JSX.Element {
    const { resetToken } = useParams();
    const token = Array.isArray(resetToken) ? resetToken[0] : resetToken;
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
                                    <BreadcrumbPage>Reset Password</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <h1 className='text-2xl font-bold'>Reset Password</h1>
                    {token == null ? (
                        <p>Token is undefined</p>
                    ) : (
                        <ResetPassword resetToken={token}/>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
