import React, { JSX } from 'react';
import { AppSidebar } from '@/features/nav/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/ui/footer';

export default function Page(): JSX.Element {
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
                                <BreadcrumbItem className='hidden md:block'>
                                    <BreadcrumbLink asChild>
                                        <Link href='/'>
                                            Home
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='hidden md:block' />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Site Map</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className='flex flex-1 flex-col gap-6 p-4'>
                    <Typography variant='h1'>Site Map</Typography>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Main Pages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Typography variant='ul' className='space-y-2'>
                                    <li>
                                        <Link href='/' className='text-blue-600 hover:underline'>
                                            Home
                                        </Link> - Welcome page and portfolio overview
                                    </li>
                                    <li>
                                        <Link href='/contact' className='text-blue-600 hover:underline'>
                                            Contact
                                        </Link> - Contact me
                                    </li>
                                    <li>
                                        <Link href='/cookies' className='text-blue-600 hover:underline'>
                                            Cookie Policy
                                        </Link> - Information about site cookies
                                    </li>
                                    <li>
                                        <Link href='/site-map' className='text-blue-600 hover:underline'>
                                            Site Map
                                        </Link> - This page
                                    </li>
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Planning Poker</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Typography variant='ul' className='space-y-2'>
                                    <li>
                                        <Link href='/planning-poker' className='text-blue-600 hover:underline'>
                                            Planning Poker Home
                                        </Link> - Main planning poker page
                                    </li>
                                    <li>
                                        <Link href='/planning-poker/create' className='text-blue-600 hover:underline'>
                                            Create Room
                                        </Link> - Create a new planning poker session
                                    </li>
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Games</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Typography variant='ul' className='space-y-2'>
                                    <li>
                                        <Link href='/reactions' className='text-blue-600 hover:underline'>
                                            Reactions
                                        </Link> - Test your reaction speed
                                    </li>
                                    <li>
                                        <Link href='/hangman' className='text-blue-600 hover:underline'>
                                            Hangman
                                        </Link> - Classic word guessing game
                                    </li>
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>User Account</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Typography variant='ul' className='space-y-2'>
                                    <li>
                                        <Link href='/login' className='text-blue-600 hover:underline'>
                                            Login
                                        </Link> - User authentication
                                    </li>
                                    <li>
                                        <Link href='/register' className='text-blue-600 hover:underline'>
                                            Register
                                        </Link> - Create a new account
                                    </li>
                                    <li>
                                        <Link href='/account' className='text-blue-600 hover:underline'>
                                            Account
                                        </Link> - User profile and settings
                                    </li>
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Portfolio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Typography variant='ul' className='space-y-2'>
                                    <li>
                                        <a href='https://batterybasics.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                                            BatteryBasics
                                        </a> - Renewable energy solutions
                                    </li>
                                    <li>
                                        <a href='https://thecommercialclearancecompany.co.uk' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                                            The Commercial Clearance Company
                                        </a> - Commercial clearance services
                                    </li>
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
}
