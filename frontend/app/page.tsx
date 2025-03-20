'use client';

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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page(): JSX.Element {
    const { user } = useAuthContext();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className='flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4'>
                    <div className='flex items-center gap-2 px-4'>
                        <SidebarTrigger className='-ml-1' />
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Home</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className='flex flex-1 flex-col gap-4 p-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-4xl font-bold'>Welcome!</h1>
                        <SocialIcons user={user}/>
                    </div>
                    <p>This is my portfolio. Below are some business sites that I've designed, built, and currently manage.</p>
                    <p>Enjoy playing the games on this site, hopefully you find the Planning Poker tool useful, if you find any bugs, or have any suggestions please don't hesitate to message me.</p>
                    <p>Thank you for visiting!</p>
                    <article className='flex flex-row gap-4 p-4 border border-foreground rounded-lg'>
                        <div className='flex flex-col gap-2'>
                            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>BatteryBasics</h3>
                            <p>Text about BatteryBasics</p>
                            <div>
                                <Button asChild variant='default' size='default'>
                                    <Link href='https://batterybasics.com' target='_blank'>
                                        Visit Site
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <picture className='flex flex-col gap-2 ml-auto'>
                            <img src='/images/batterybasics.png' alt='BatteryBasics' className='rounded-lg' />
                        </picture>
                    </article>
                    <article className='flex flex-row gap-4 p-4 border border-foreground rounded-lg'>
                        <div className='flex flex-col gap-2'>
                            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>The Commercial Clearance Company</h3>
                            <p>Text about commercial clearance company</p>
                            <div>
                                <Button asChild variant='default' size='default'>
                                    <Link href='https://thecommercialclearancecompany.co.uk' target='_blank'>
                                        Visit Site
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <picture className='flex flex-col gap-2 ml-auto'>
                            <img src='/images/thecommercialclearancecompany.png' alt='The Commercial Clearance Company' className='rounded-lg' />
                        </picture>
                    </article>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
