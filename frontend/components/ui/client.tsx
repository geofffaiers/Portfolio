'use client';

import React, { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Card } from './card';
import { Typography } from './typography';
import { Skeleton } from './skeleton';
import { useTheme } from 'next-themes';

type Props = {
    name: string;
    text: JSX.Element;
    url?: string;
    image?: JSX.Element;
    imageSrcLight?: string;
    imageSrcDark?: string;
    imageSrc?: string;
    buttonText?: string;
};

export const Client: React.FC<Props> = ({
    name,
    text,
    url,
    image,
    imageSrc,
    imageSrcLight,
    imageSrcDark,
    buttonText
}) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    let img: JSX.Element | undefined;

    if (!mounted) {
        img = (
            <Skeleton className='h-[75px] w-full rounded-lg' />
        );
    } else if (image != null) {
        img = image;
    } else if (imageSrc || imageSrcLight || imageSrcDark) {
        const imageToUse = resolvedTheme === 'dark'
            ? imageSrcDark || imageSrc
            : imageSrcLight || imageSrc;
        img = url ? (
            <Link href={url} target='_blank' className='flex flex-col gap-2'>
                <picture>
                    <img src={imageToUse} alt={name} className='rounded-lg h-[75px] max-w-full object-contain'/>
                </picture>
            </Link>
        ) : (
            <picture>
                <img src={imageToUse} alt={name} className='rounded-lg h-[75px] max-w-full object-contain'/>
            </picture>
        );
    } else {
        img = (
            <Typography variant='h3'>{name}</Typography>
        );
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Card className='p-4'>
            <div className='flex flex-col gap-4 h-full'>
                {img}
                {text}
                {url && (
                    <div className='mt-auto'>
                        <Button asChild variant='default' size='default'>
                            <Link href={url} target='_blank'>
                                {buttonText ? buttonText : 'Visit Site'}
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};
