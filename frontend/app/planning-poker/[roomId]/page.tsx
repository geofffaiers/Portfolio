'use client';

import React, { JSX, useCallback, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Share2 } from 'lucide-react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useConfigContext } from '@/components/providers/config-provider';
import { Project } from '@/models';
import { PageLoading } from '@/components/ui/page-loading';
import { Button } from '@/components/ui/button';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';

import { PlanningPoker } from './planning-poker';

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
                <Button
                    variant='outline'
                    size='default'
                    onClick={shareRoom}
                >
                    Share
                    <Share2 />
                </Button>
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <PlanningPoker roomId={String(roomId ?? '')} setRoomName={setRoomName}/>
            </div>
        </SidebarInset>
    );
}
