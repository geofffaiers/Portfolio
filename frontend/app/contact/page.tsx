import React, { JSX } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { ContactForm } from '@/features/contact-form';
import { Footer } from '@/components/ui/footer';
import { SocialIcons } from '@/components/ui/social-icons';
import { OpenMessaging } from '@/features/messaging';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const metadata: Metadata = {
    title: 'Contact Geoff',
    description: 'Contact details for Geoff Faiers'
};

export default function Page(): JSX.Element {
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
                                <BreadcrumbPage>Contact</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <ThemeToggle />
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4'>
                <div className='flex justify-between items-center'>
                    <Typography variant='h1'>Contact Me</Typography>
                    <SocialIcons/>
                </div>
                <Typography variant='p'>If you have any questions, suggestions, or just want to say hello, feel free to reach out using messaging, or the form below. I look forward to hearing from you!</Typography>
                <OpenMessaging />
                <ContactForm />
            </div>
            <Footer />
        </SidebarInset>
    );
}
