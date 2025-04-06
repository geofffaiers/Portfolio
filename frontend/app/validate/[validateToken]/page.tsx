'use client';

import React, { JSX } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useValidate } from './use-validate';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';

export default function Page(): JSX.Element {
    const { validateToken } = useParams();
    const token = Array.isArray(validateToken) ? validateToken[0] : validateToken;
    const { error } = useValidate({ validateToken: token as string });
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
                                <BreadcrumbPage>Validate Email Account</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4'>
                {error !== '' ? (
                    <>
                        <Typography variant='h1'>Validate email error</Typography>
                        <Typography variant='p'>{error}</Typography>
                    </>
                ) : (
                    <>
                        <Typography variant='h1'>Validate email account</Typography>
                        <Loader2 className='w-10 h-10 animate-spin' />
                    </>
                )}
            </div>
        </SidebarInset>
    );
}
