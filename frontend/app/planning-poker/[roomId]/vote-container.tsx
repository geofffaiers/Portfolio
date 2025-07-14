import React from 'react';

import { useUserDetails } from '@/hooks/use-user-details';
import { Player, Round } from '@/models';
import { cn } from '@/lib/utils';

import { Card } from './card';

type Props = {
    round: Round;
    isUser: boolean;
    player: Player;
    vote: string;
};

export const MobileVoteContainer: React.FC<Props> = ({ round, isUser, player, vote }) => {
    const { userName } = useUserDetails({ user: player });
    return (
        <div className='flex flex-col items-center justify-center w-24'>
            <Card value={vote} length={1} selected={null} hiddenVote={round.inProgress} player={player}/>
            <div className={cn(
                'mt-4 text-center overflow-hidden text-ellipsis',
                isUser && 'font-bold',
            )}>{isUser ? 'You' : userName}</div>
        </div>
    );
};

export const VoteContainer: React.FC<
    Props & { coordinates: { x: number, y: number } }
> = ({ round, isUser, player, vote, coordinates: { x, y } }) => {
    const { userName } = useUserDetails({ user: player });
    const title = `${userName} (${player.role.charAt(0).toUpperCase() + player.role.slice(1)}) - ${player.online ? 'Online' : 'Offline'}`;
    return (
        <div
            title={title}
            className='absolute w-16'
            style={{
                transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                top: '50%',
                left: '50%',
            }}
        >
            <Card value={vote} length={1} selected={null} hiddenVote={round.inProgress} player={player}/>
            <div className={cn(
                'mt-4 text-center overflow-hidden text-ellipsis',
                isUser && 'font-bold',
            )}>{isUser ? 'You' : userName}</div>
        </div>
    );
};
