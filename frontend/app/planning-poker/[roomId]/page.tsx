'use client';

import React, { useCallback, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { JSX } from 'react';
import { useConfigContext } from '@/components/providers/config-provider';
import { Project } from '@/models';
import { useParams, useRouter } from 'next/navigation';
import { PageLoading } from '@/components/ui/page-loading';
import Link from 'next/link';
import { PlanningPoker } from './planning-poker';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Page(): JSX.Element {
    const { roomId } = useParams();
    const { configLoading, config: { projects } } = useConfigContext();
    const { displayInfo, displayError } = useToastWrapper();
    const [roomName, setRoomName] = useState<string>('');

    const project: Project | undefined = projects.find((project) => project.id === 2 && project.isEnabled);

    const router = useRouter();

    const shareRoom = useCallback(() => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                displayInfo('Room link copied to clipboard!');
            })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    displayError(error.message);
                } else {
                    displayError('Failed to copy room link');
                }
            });
    }, [displayInfo, displayError]);

    if (configLoading) {
        return <PageLoading />;
    }

    if (!project) {
        router.replace('/page-not-found');
        return <></>;
    }

    return (
        <SidebarInset>
            <header className='flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between'>
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
                                <BreadcrumbLink asChild>
                                    <Link href={project.url}>
                                        {project.name}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className='hidden md:block' />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{roomName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className='flex items-end gap-2 ml-auto'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={shareRoom}
                        className='h-7 border-none'
                    >
                        Share
                        <Share2 />
                    </Button>
                    <ThemeToggle isWrapped={false} />
                </div>
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <PlanningPoker roomId={String(roomId ?? '')} setRoomName={setRoomName}/>
            </div>
        </SidebarInset>
    );
}
