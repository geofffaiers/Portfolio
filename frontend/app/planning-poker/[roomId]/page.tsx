"use client";

import React, { useState } from 'react';
import { AppSidebar } from '@/features/nav/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { JSX } from 'react';
import { useConfigContext } from '@/components/providers/config-provider';
import { Project } from '@/models';
import { useParams, useRouter } from 'next/navigation';
import { PageLoading } from '@/components/ui/page-loading';
import Link from 'next/link';
import { PlanningPoker } from './planning-poker';

export default function Page(): JSX.Element {
    const { roomId } = useParams();
    const { configLoading, config: { projects } } = useConfigContext();
    const [roomName, setRoomName] = useState<string>('');

    const project: Project | undefined = projects.find((project) => project.id === 2 && project.isEnabled)

    const router = useRouter();

    if (configLoading) {
        return <PageLoading />;
    }

    if (!project) {
        router.replace('/page-not-found');
        return <></>;
    }
    
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink asChild>
                                        <Link href="/">
                                            Home
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={project.url}>
                                            {project.name}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{roomName}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <PlanningPoker roomId={String(roomId ?? '')} setRoomName={setRoomName}/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
