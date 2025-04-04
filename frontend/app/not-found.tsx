import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-background'>
            <Typography variant='h1'>404 - Page Not Found</Typography>
            <Typography variant='p' className='my-4 text-lg'>
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </Typography>
            <Button
                asChild
                variant='default'
                size='lg'
            >
                <Link href='/'>Go home</Link>
            </Button>
        </div>
    );
}
