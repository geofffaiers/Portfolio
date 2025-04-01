'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { usePathname } from 'next/navigation';
import { Typography } from './typography';

type Props = {
    message: string
};

export const AccessRestricted: React.FC<Props> = ({ message }) => {
    const currentPath = usePathname();

    return (
        <div className='flex h-full w-full items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <div className='flex flex-col gap-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-2xl'>Restricted</CardTitle>
                            <CardDescription>
                                Please sign in or register
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Typography variant='p'>{message}</Typography>
                            <div className='flex flex-row gap-4 justify-end'>
                                <Button
                                    className='mt-4'
                                    size='lg'
                                    variant='secondary'
                                >
                                    <Link href={`/login?returnUrl=${encodeURIComponent(currentPath)}`}>
                                        Sign In
                                    </Link>
                                </Button>
                                <Button
                                    className='mt-4'
                                    size='lg'
                                    variant='secondary'
                                >
                                    <Link href='/register'>
                                        Register
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
