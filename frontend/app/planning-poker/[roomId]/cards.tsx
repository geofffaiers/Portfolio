import React from 'react';
import { Round } from '@/models';
import { useCards } from './use-cards';
import { Card } from './card';
import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';
import { cn } from '@/lib/utils';

type CardsProps = {
    round: Round;
};

export const Cards: React.FC<CardsProps> = ({ round }) => {
    const { isMobile, isTablet } = useDeviceBreakpoints();
    const { options, selected, submitVote } = useCards({ round });
    return (
        <div className={cn(
            'flex flex-wrap gap-4 justify-center my-auto',
            !round.inProgress ? 'opacity-50 pointer-events-none' : '',
        )}>
            {options.map((option) => (
                <Card key={option} value={option} length={isMobile || isTablet ? options.length / 2 : options.length} selected={selected} submitVote={submitVote} />
            ))}
        </div>
    );
};
