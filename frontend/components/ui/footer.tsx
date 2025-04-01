import React from 'react';
import { Typography } from './typography';
import Link from 'next/link';

export const Footer: React.FC = () => {
    return (
        <footer className='mt-auto border-t p-4'>
            <Typography variant='ul' className='flex flex-row gap-6 list-none text-sm m-0 mb-2'>
                <li><Link href='/contact'>Contact</Link></li>
                <li><Link href='/cookies'>Cookies Policy</Link></li>
                <li><Link href='/privacy-policy'>Privacy Policy</Link></li>
                <li><Link href='/site-map'>Site Map</Link></li>
            </Typography>
        </footer>
    );
};
