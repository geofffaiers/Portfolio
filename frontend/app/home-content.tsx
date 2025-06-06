'use client';

import React, { JSX } from 'react';

import { Client } from '@/components/ui/client';
import { SocialIcons } from '@/components/ui/social-icons';
import { Typography } from '@/components/ui/typography';

export function HomeContent(): JSX.Element {

    return (
        <div className='flex flex-1 flex-col gap-4 p-4'>
            <div className='flex justify-between items-center'>
                <Typography variant='h1'>Welcome!</Typography>
                <SocialIcons />
            </div>
            <Typography variant='p'>This is my portfolio. Below are some business sites that I&apos;ve designed, built, and currently manage.</Typography>
            <Typography variant='p'>Enjoy playing the games on this site, hopefully you find the Planning Poker tool useful, if you find any bugs, or have any suggestions please don&apos;t hesitate to message me.</Typography>
            <Typography variant='p'>Thank you for visiting!</Typography>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Client
                    name='BatteryBasics'
                    imageSrcLight='/logos/battery-basics-black.png'
                    imageSrcDark='/logos/battery-basics-white.png'
                    url='https://batterybasics.com'
                    text={
                        <>
                            <Typography variant='p'>Battery Basics is a leading company in the renewable energy sector, providing diverse solutions for both residential and commercial customers. Whether you need solar panels, batteries, or both, they can design and install the system that meets your requirements and preferences.</Typography>
                            <Typography variant='p'>They are committed to delivering excellent customer service and supporting you throughout your journey. Whether you are just exploring your options or ready to switch to renewable energy, they are here to help!</Typography>
                        </>
                    }
                />
                <Client
                    name='The Commercial Clearance Company'
                    imageSrc='/logos/the-commercial-clearance-company.png'
                    url='https://thecommercialclearancecompany.co.uk'
                    text={<Typography variant='p'>The Commercial Clearance Company specialize in providing comprehensive commercial clearance services across the nation. Their expert team is dedicated to ensuring a thorough and efficient clearance process, tailored to meet your specific needs. Whether you require a complete property clearance or the removal of unwanted items, they handle everything from start to finish. Their meticulous approach ensures that your commercial space is cleared, organized, and ready for the next phase of your project.</Typography>}
                />
            </div>
        </div>
    );
}
