'use client';

import React from 'react';

import { Game, Player, Room, Round } from '@/models';
import { cn } from '@/lib/utils';

import { RoundControls } from './round-controls';
import { RoundMetrics } from './round-metrics';
import { useCurrentRound } from './use-current-round';
import { MobileVoteContainer, VoteContainer } from './vote-container';

type Props = {
    player: Player;
    room: Room;
    game: Game;
    round: Round;
};

export const CurrentRound: React.FC<Props> = ({ player, room, game, round }) => {
    const players = room.players;
    const { containerRef, radius, isMobile, displayMetrics, setDisplayMetrics } = useCurrentRound({ round });

    return (
        <main ref={containerRef} className='flex flex-grow flex-col'>
            {!round.inProgress && <RoundMetrics player={player} game={game} round={round} displayMetrics={displayMetrics} setDisplayMetrics={setDisplayMetrics}/>}
            <div className={cn(
                'flex flex-grow',
                isMobile ? 'items-start justify-start gap-4 flex-wrap content-start' : 'relative inset-0 items-center justify-center',
            )}>
                {players.map((p: Player, index: number) => {
                    const isUser = p.id === player.id;
                    const vote = round.votes.find((v) => v.playerId === p.id);
                    if (isMobile) {
                        return <MobileVoteContainer key={`vote-container-${index}`} isUser={isUser} round={round} player={p} vote={vote?.value ?? ''}/>;
                    }
                    const angle = (index / players.length) * 2 * Math.PI;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    return <VoteContainer key={`vote-container-${index}`} isUser={isUser} round={round} player={p} vote={vote?.value ?? ''} coordinates={{ x, y }}/>;
                })}
            </div>
            <RoundControls player={player} game={game} round={round} setDisplayMetrics={setDisplayMetrics}/>
        </main>
    );
};
