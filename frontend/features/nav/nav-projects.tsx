'use client';

import React, { useMemo } from 'react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useConfigContext } from '@/components/providers/config-provider';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function NavProjects() {
    const { open } = useSidebar();
    const currentPath = usePathname();
    const { configLoading, config: { projects } } = useConfigContext();
    const enabledProjects = useMemo(() => projects.filter((item) => item.isEnabled), [projects]);
    return (
        <SidebarGroup>
            <SidebarMenu>
                {enabledProjects.map((item) => {
                    const isActive = currentPath === item.url;
                    return (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild
                                tooltip={ open ? undefined : {
                                    children: item.name,
                                    hidden: false,
                                }}
                                isActive={isActive}
                                className={'px-2.5 md:px-2'}
                            >
                                <Link href={item.url} target={item.target}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
                {configLoading && (<Skeleton className="h-7" />)}
                {!configLoading && enabledProjects.length === 0 && (
                    <>No pages are enabled.</>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
