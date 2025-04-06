import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { JSX } from 'react';
import { SocialIcons } from '@/components/ui/social-icons';
import { Client } from '@/components/ui/client';
import { Typography } from '@/components/ui/typography';
import { Footer } from '@/components/ui/footer';

export default function Page(): JSX.Element {
    return (
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
                    <Typography variant='h1'>Welcome!</Typography>
                    <SocialIcons/>
                </div>
                <Typography variant='p'>This is my portfolio. Below are some business sites that I&apos;ve designed, built, and currently manage.</Typography>
                <Typography variant='p'>Enjoy playing the games on this site, hopefully you find the Planning Poker tool useful, if you find any bugs, or have any suggestions please don&apos;t hesitate to message me.</Typography>
                <Typography variant='p'>Thank you for visiting!</Typography>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
            </div>
            <Footer />
        </SidebarInset>
    );
}
