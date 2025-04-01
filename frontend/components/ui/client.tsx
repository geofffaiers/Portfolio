import React, { JSX } from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Card } from './card';

type Props = {
    name: string;
    url: string;
    text: JSX.Element;
    image?: JSX.Element | undefined;
    imageSrc?: string | undefined;
    buttonText?: string | undefined
};

export const Client: React.FC<Props> = ({ name, url, text, image, imageSrc, buttonText }) => {
    let img: JSX.Element | undefined;
    if (image != null) {
        img = image;
    } else if (imageSrc != null) {
        img = (
            <Link href={url} target='_blank' className='flex flex-col gap-2'>
                <picture>
                    <img src={imageSrc} alt={name} className='rounded-lg w-[300px] h-auto'/>
                </picture>
            </Link>
        );
    } else {
        img = (
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{name}</h3>
        );
    }
    return (
        <Card className='p-4'>
            <div className='flex flex-col gap-4'>
                {img}
                {text}
                <div>
                    <Button asChild variant='default' size='default'>
                        <Link href={url} target='_blank'>
                            {buttonText ? buttonText : 'Visit Site'}
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
};
