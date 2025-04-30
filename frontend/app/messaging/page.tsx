'use client';

import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { JSX } from 'react';
import Link from 'next/link';
import { useConfigContext } from '@/components/providers/config-provider';
import { Project } from '@/models';
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components/ui/page-loading';
import { MessagingAuth } from './messaging-auth';

export default function Page(): JSX.Element {
    const { configLoading, config: { projects } } = useConfigContext();
    const project: Project | undefined = projects.find((project) => project.id === 4 && project.isEnabled);

    const router = useRouter();

    if (configLoading) {
        return <PageLoading />;
    }

    if (!project) {
        router.replace('/page-not-found');
        return <></>;
    }

    return (
        <SidebarInset className='flex flex-col h-[100vh] max-h-[100vh]'>
            <header className='flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4'>
                <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator orientation='vertical' className='mr-2 h-4' />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className='hidden md:block'>
                                <BreadcrumbLink asChild>
                                    <Link href='/'>Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className='hidden md:block' />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Messaging</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className='flex-1 min-h-0 flex w-full'>
                <MessagingAuth />
            </div>
        </SidebarInset>
    );
}
