'use client';

import React, { JSX, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/components/providers/auth-provider';
import { User } from '@/models';

import { LoginForm } from './login-form';

export const LoginPage = (): JSX.Element => {
    const { user } = useAuthContext();

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
                                <BreadcrumbPage>Login</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className='flex h-full w-full items-center justify-center p-6 md:p-10'>
                <div className='w-full max-w-sm'>
                    <Suspense fallback={<Loader2 className='animate-spin' />}>
                        <Login user={user}/>
                    </Suspense>
                </div>
            </div>
        </SidebarInset>
    );
};

const Login = ({ user }: { user: User | null | undefined }): JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (user) {
            const returnUrl = searchParams.get('returnUrl') || '/account';
            router.push(returnUrl === '/' ? '/account' : returnUrl);
        }
    }, [user, searchParams, router]);

    return (
        <>
            {(user || user === undefined) && (
                <div className='flex items-center justify-center'>
                    <Loader2 className='animate-spin' />
                </div>
            )}
            {user === null && <LoginForm />}
        </>
    );
};
