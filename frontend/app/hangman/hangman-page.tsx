'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useConfigContext } from '@/components/providers/config-provider';
import { Project } from '@/models';
import { PageLoading } from '@/components/ui/page-loading';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { Hangman } from './hangman';

export const HangmanPage = (): JSX.Element => {
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
                                <BreadcrumbPage>{project.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <ThemeToggle />
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <Hangman />
            </div>
        </SidebarInset>
    );
};
