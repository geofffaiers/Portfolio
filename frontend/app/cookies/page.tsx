import React, { JSX } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import { Footer } from '@/components/ui/footer';

export default function Page(): JSX.Element {
    const date = new Date();
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
                                <BreadcrumbPage>Cookie Policy</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4 max-w-4xl'>
                <Typography variant='h1'>Cookie Policy</Typography>

                <Typography variant='p'>
                    This Cookie Policy explains how gfaiers.com (&quot;I&quot;, &quot;me&quot;, or &quot;my&quot;) uses cookies and similar
                    technologies when you visit or use services on gfaiers.com (the &quot;Website&quot;). This policy
                    should be read alongside the <Link href='/privacy-policy' className='font-medium underline underline-offset-4'>Privacy Policy</Link>.
                </Typography>

                <Typography variant='h2'>What Are Cookies?</Typography>
                <Typography variant='p'>
                    Cookies are small text files that are placed on your device when you visit a website.
                    They are widely used to make websites work more efficiently and provide information to
                    website owners. Cookies enhance your browsing experience by:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li>Remembering your preferences and settings</li>
                    <li>Enabling you to log in to secure areas of the Website</li>
                    <li>Helping website owners understand how you interact with their site</li>
                </Typography>

                <Typography variant='h2'>Types of Cookies Used</Typography>
                <Typography variant='p'>
                    The Website uses the following types of cookies:
                </Typography>

                <Typography variant='h3'>Essential Cookies</Typography>
                <Typography variant='p'>
                    These cookies are necessary for the Website to function properly. They enable core
                    functionality such as security, network management, and account authentication.
                    You cannot opt out of these cookies as the Website would not function properly without them.
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li><strong>Authentication cookies:</strong> Used to verify your identity when you log in and maintain your logged-in status</li>
                    <li><strong>Security cookies:</strong> Used to detect authentication abuses and protect user data from unauthorized access</li>
                    <li><strong>Session cookies:</strong> Temporary cookies that are erased when you close your browser</li>
                </Typography>

                <Typography variant='h3'>Preference Cookies</Typography>
                <Typography variant='p'>
                    These cookies remember your preferences and settings, such as language preference
                    and cookie consent choices, ensuring you&apos;re not repeatedly asked for the same information.
                </Typography>

                <Typography variant='h2'>Duration of Cookies</Typography>
                <Typography variant='p'>
                    Cookies can remain on your device for different periods of time:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li><strong>Session cookies:</strong> These are temporary and expire when you close your browser</li>
                    <li><strong>Persistent cookies:</strong> These remain on your device until they expire or are deleted</li>
                </Typography>

                <Typography variant='h2'>Third-Party Cookies</Typography>
                <Typography variant='p'>
                    Currently, the Website does not use third-party cookies. Should this change in the future,
                    this Cookie Policy will be updated to reflect such changes.
                </Typography>

                <Typography variant='h2'>Your Cookie Choices</Typography>
                <Typography variant='p'>
                    Most web browsers allow you to control cookies through their settings preferences.
                    These browser controls typically give you the ability to:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li>View cookies stored on your device</li>
                    <li>Delete all or specific cookies</li>
                    <li>Block or allow cookies by default</li>
                    <li>Block third-party cookies</li>
                </Typography>
                <Typography variant='p'>
                    Please note that if you choose to disable cookies, some features of the Website may not function properly.
                </Typography>

                <Typography variant='h3'>How to Manage Cookies in Major Browsers</Typography>
                <Typography variant='ul' className='my-0'>
                    <li><strong>Google Chrome:</strong> Menu &gt; Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
                    <li><strong>Mozilla Firefox:</strong> Menu &gt; Options &gt; Privacy & Security &gt; Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
                    <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data</li>
                </Typography>

                <Typography variant='h2'>Do Not Track Signals</Typography>
                <Typography variant='p'>
                    Some browsers have a &quot;Do Not Track&quot; feature that signals to websites that you visit
                    that you do not want to have your online activity tracked. The Website currently does
                    not respond to &quot;Do Not Track&quot; signals.
                </Typography>

                <Typography variant='h2'>Updates to This Cookie Policy</Typography>
                <Typography variant='p'>
                    I may update this Cookie Policy from time to time to reflect changes in technology,
                    regulation, or my business practices. Any changes will be posted on this page with
                    an updated effective date. You are encouraged to review this Cookie Policy periodically
                    for any changes.
                </Typography>

                <Typography variant='h2'>Contact Information</Typography>
                <Typography variant='p'>
                    If you have any questions about this Cookie Policy or my use of cookies, please contact me at:
                </Typography>
                <Typography variant='p'>
                    Email: info@gfaiers.com
                </Typography>

                <Typography variant='p' className='text-sm text-muted-foreground mt-8'>
                    Effective Date: {date.toLocaleDateString('en-GB')}
                </Typography>
            </div>
            <Footer />
        </SidebarInset>
    );
}
