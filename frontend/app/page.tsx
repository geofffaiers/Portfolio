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
import { Client } from '@/components/ui/client';

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
                    <p>This is my portfolio. Below are some business sites that I&apos;ve designed, built, and currently manage.</p>
                    <p>Enjoy playing the games on this site, hopefully you find the Planning Poker tool useful, if you find any bugs, or have any suggestions please don&apos;t hesitate to message me.</p>
                    <p>Thank you for visiting!</p>
                    <Client
                        name='BatteryBasics'
                        imageSrc='/logos/battery-basics-white.png'
                        url='https://batterybasics.com'
                        text={
                            <>
                                <p><strong>BatteryBasics</strong> is a leading company in the renewable energy sector, providing diverse solutions for both residential and commercial customers. Whether you need solar panels, batteries, or both, they can design and install the system that meets your requirements and preferences.</p>
                                <p>They are committed to delivering excellent customer service and supporting you throughout your journey. Whether you are just exploring your options or ready to switch to renewable energy, they are here to help!</p>
                            </>
                        }
                    />
                    <Client
                        name='The Commercial Clearance Company'
                        imageSrc='/logos/the-commercial-clearance-company.png'
                        url='https://thecommercialclearancecompany.co.uk'
                        text={<p>The Commercial Clearance Company specialize in providing comprehensive commercial clearance services across the nation. Their expert team is dedicated to ensuring a thorough and efficient clearance process, tailored to meet your specific needs. Whether you require a complete property clearance or the removal of unwanted items, they handle everything from start to finish. Their meticulous approach ensures that your commercial space is cleared, organized, and ready for the next phase of your project.</p>}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
