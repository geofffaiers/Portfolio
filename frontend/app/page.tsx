"use client";

import React from 'react';
import { AppSidebar } from '@/features/nav/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { JSX } from 'react';
import { SocialIcons } from '@/components/ui/social-icons';
import { useAuthContext } from '@/components/providers/auth-provider';

export default function Page(): JSX.Element {
    const { user } = useAuthContext();

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
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Home</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-bold">Welcome!</h1>
                        <SocialIcons user={user}/>
                    </div>
                    <p>Enjoy browsing my page, try beat the top scores, use my planning poker tool, register on the site to chat with me.</p>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
