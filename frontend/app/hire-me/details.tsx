import React from 'react';
import { User } from '@/models';
import { SocialIcons } from '@/components/ui/social-icons';

type Props = {
    user?: User | null;
};

export const Details: React.FC<Props> = ({ user }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Geoff Faiers</h1>
                <SocialIcons user={user}/>
            </div>
            <h4 className="text-xl font-medium mt-4">
                {user != null
                    ? '8 Segrave Walk, York, YO26 4UD / 07795102820 / geoff@gfaiers.com'
                    : 'York, United Kingdom / info@gfaiers.com'}
            </h4>
        </div>
    );
};
