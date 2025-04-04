'use client';
import React from 'react';
import {
    BadgeCheck,
    ChevronsUpDown,
    LogIn,
    LogOut,
} from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useAuthContext } from '../../components/providers/auth-provider';
import { usePathname } from 'next/navigation';
import { User } from '@/models';
import { useUserDetails } from '@/hooks/use-user-details';
import { useLogout } from '@/hooks/use-logout';
import Link from 'next/link';

export function NavUser() {
    const { user } = useAuthContext();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {user
                    ? <LoggedIn user={user}/>
                    : <LoggedOut />
                }
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function LoggedIn({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    const { userName, initials } = useUserDetails({ user });
    const { handleLogout } = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                    <Avatar className='h-8 w-8 rounded-lg'>
                        <AvatarImage src={user?.profilePicture} alt={userName} />
                        <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>{userName}</span>
                        {user != null && <span className='truncate text-xs'>{user.email}</span>}
                    </div>
                    <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align='end'
                sideOffset={4}
            >
                <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                        <Avatar className='h-8 w-8 rounded-lg'>
                            <AvatarImage src={user?.profilePicture} alt={userName} />
                            <AvatarFallback className='rounded-lg'>{initials}</AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 text-left text-sm leading-tight'>
                            <span className='truncate font-semibold'>{userName}</span>
                            {user != null && <span className='truncate text-xs'>{user.email}</span>}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className='cursor-pointer'>
                        <Link href='/account'>
                            <BadgeCheck />
                            Account
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function LoggedOut() {
    const { open } = useSidebar();
    const currentPath = usePathname();
    const isActive = currentPath === '/login';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild
                    tooltip={ open ? undefined : {
                        children: 'Login',
                        hidden: false,
                    }}
                    isActive={isActive}
                    className={'px-2.5 md:px-2'}
                >
                    <Link href={`/login?returnUrl=${encodeURIComponent(currentPath)}`}>
                        <LogIn />
                        <span>Login / Sign up</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
