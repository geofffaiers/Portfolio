import React, { JSX } from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Card } from './card';
import { Typography } from './typography';

type Props = {
    name: string;
    text: JSX.Element;
    url?: string;
    image?: JSX.Element;
    imageSrc?: string;
    buttonText?: string;
};

export const Client: React.FC<Props> = ({ name, text, url, image, imageSrc, buttonText }) => {
    let img: JSX.Element | undefined;
    if (image != null) {
        img = image;
    } else if (imageSrc != null) {
        img = url ? (
            <Link href={url} target='_blank' className='flex flex-col gap-2'>
                <picture>
                    <img src={imageSrc} alt={name} className='rounded-lg h-[75px] max-w-full object-contain'/>
                </picture>
            </Link>
        ) : (
            <picture>
                <img src={imageSrc} alt={name} className='rounded-lg h-[75px] max-w-full object-contain'/>
            </picture>
        );
    } else {
        img = (
            <Typography variant='h3'>{name}</Typography>
        );
    }
    return (
        <Card className='p-4 w-[calc(50% - 1rem)]]'>
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
