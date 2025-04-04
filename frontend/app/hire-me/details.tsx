import React from 'react';
import { User } from '@/models';
import { SocialIcons } from '@/components/ui/social-icons';
import { Typography } from '@/components/ui/typography';

type Props = {
    user?: User | null;
};

export const Details: React.FC<Props> = ({ user }) => {
    return (
        <div className='mb-8'>
            <div className='flex justify-between items-center'>
                <Typography variant='h1'>Geoff Faiers</Typography>
                <SocialIcons user={user}/>
            </div>
            <Typography variant='h4'>
                {user != null
                    ? '8 Segrave Walk, York, YO26 4UD / 07795102820 / geoff@gfaiers.com'
                    : 'York, United Kingdom / info@gfaiers.com'}
            </Typography>
        </div>
    );
};
