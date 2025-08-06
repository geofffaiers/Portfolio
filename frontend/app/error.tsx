'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export default function Error({
    error,
    reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-background'>
            <Typography variant='h1'>Something went wrong</Typography>
            <Typography variant='p' className='my-4 text-lg'>
                {error.message ?? 'An unexpected error occurred.'}
            </Typography>
            <div className='flex gap-4'>
                <Button variant='default' size='lg' onClick={() => reset()}>
          Try again
                </Button>
                <Button asChild variant='secondary' size='lg'>
                    <Link href='/'>Go home</Link>
                </Button>
            </div>
        </div>
    );
}
