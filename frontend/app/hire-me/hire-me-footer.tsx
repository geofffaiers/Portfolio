import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContactDialog } from './contact-dialog';
import { User } from '@/models';
import { Typography } from '@/components/ui/typography';

type Props = {
    user?: User | null;
};

export const HireMeFooter: React.FC<Props> = ({ user }) => {
    return (
        <footer className='sticky bottom-0 p-4 shadow-lg' style={{ backgroundColor: 'hsl(var(--background))' }}>
            <div className='flex flex-col items-center p-6 gap-4'>
                <Typography variant='h4' className='text-center'>
                    I am available for hire, let&#39;s work together!
                </Typography>
                <div className='flex flex-wrap justify-center gap-4'>
                    {user != null && (
                        <Button asChild variant='secondary' size='lg'>
                            <Link target='_blank' href='/Geoffrey_Faiers.pdf' rel='noopener noreferrer'>Download CV</Link>
                        </Button>
                    )}
                    {user == null && <ContactDialog />}
                </div>
            </div>
        </footer>
    );
};
