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
import { Footer } from '@/components/ui/footer';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for gfaiers.com',
    openGraph: {
        title: 'Privacy Policy',
        description: 'Privacy Policy for gfaiers.com',
        url: '/privacy-policy',
        siteName: 'Geoff Faiers',
        images: [
            {
                url: '/images/privacy-policy.png',
                width: 1200,
                height: 630,
                alt: 'Privacy Policy',
            },
        ],
    }
};

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
                                <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <ThemeToggle />
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4 max-w-4xl'>
                <Typography variant='h1'>Privacy Policy</Typography>

                <Typography variant='p'>
                    This Privacy Policy describes how gfaiers.com (&quot;I&quot;, &quot;me&quot;, or &quot;my&quot;) collects, uses, and discloses your
                    personal information when you visit or use services on gfaiers.com (the &quot;Website&quot;), a portfolio site
                    showcasing my abilities as a software developer.
                </Typography>

                <Typography variant='h2'>Information I Collect</Typography>
                <Typography variant='p'>
                    When you register for an account on the Website, I collect the following information:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li><strong>Full Name</strong> (optional)</li>
                    <li><strong>Email Address</strong> (required)</li>
                    <li><strong>Password</strong> (required)</li>
                    <li><strong>Account Name</strong> (required)</li>
                </Typography>

                <Typography variant='p'>
                    I also automatically collect certain information when you visit the Website, including:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Pages you view</li>
                    <li>How you interact with the Website</li>
                </Typography>

                <Typography variant='h2'>How I Use Your Information</Typography>
                <Typography variant='p'>
                    I use the information I collect to:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li>Provide, maintain, and improve the Website</li>
                    <li>Process and complete transactions</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Understand how users interact with the Website</li>
                    <li>Detect, prevent, and address technical issues</li>
                    <li>Protect against harmful or unauthorized activity</li>
                </Typography>

                <Typography variant='h2'>Cookies and Similar Technologies</Typography>
                <Typography variant='p'>
                    The Website uses cookies and similar tracking technologies to track activity and retain certain
                    information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </Typography>

                <Typography variant='p'>
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                    if you do not accept cookies, you may not be able to use some portions of the Website.
                </Typography>

                <Typography variant='h2'>Data Security</Typography>
                <Typography variant='p'>
                    The security of your data is important to me, but remember that no method of transmission over the Internet
                    or method of electronic storage is 100% secure. While I strive to use commercially acceptable means to protect
                    your personal information, I cannot guarantee its absolute security.
                </Typography>

                <Typography variant='h2'>User Accounts</Typography>
                <Typography variant='p'>
                    When you create an account on the Website, you are responsible for maintaining the confidentiality of your
                    account and password and for restricting access to your computer. You agree to accept responsibility for
                    all activities that occur under your account.
                </Typography>

                <Typography variant='h2'>Third-Party Services</Typography>
                <Typography variant='p'>
                    Currently, I do not share your information with third parties. Should this change in the future,
                    this Privacy Policy will be updated to reflect such changes.
                </Typography>

                <Typography variant='h2'>Data Retention</Typography>
                <Typography variant='p'>
                    I will retain your personal information only for as long as is necessary for the purposes set out in this
                    Privacy Policy. I will retain and use your information to the extent necessary to comply with legal obligations,
                    resolve disputes, and enforce policies.
                </Typography>

                <Typography variant='h2'>Children&apos;s Privacy</Typography>
                <Typography variant='p'>
                    The Website is not intended for use by children under the age of 16. I do not knowingly collect personally
                    identifiable information from children under 16. If you are a parent or guardian and you are aware that your
                    child has provided me with personal information, please contact me at info@gfaiers.com.
                </Typography>

                <Typography variant='h2'>Your Rights</Typography>
                <Typography variant='p'>
                    Under UK data protection law, you have the following rights:
                </Typography>
                <Typography variant='ul' className='my-0'>
                    <li>The right to access information I hold about you</li>
                    <li>The right to request correction of any inaccurate personal information</li>
                    <li>The right to request erasure of your personal information</li>
                    <li>The right to object to processing of your personal information</li>
                    <li>The right to request restriction of processing your personal information</li>
                    <li>The right to data portability</li>
                </Typography>
                <Typography variant='p'>
                    To exercise any of these rights, please contact me at info@gfaiers.com.
                </Typography>

                <Typography variant='h2'>Changes to This Privacy Policy</Typography>
                <Typography variant='p'>
                    I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new
                    Privacy Policy on this page and updating the &quot;Effective Date&quot; at the bottom.
                </Typography>
                <Typography variant='p'>
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
                    are effective when they are posted on this page.
                </Typography>

                <Typography variant='h2'>Contact Information</Typography>
                <Typography variant='p'>
                    If you have any questions about this Privacy Policy, please contact me at:
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
