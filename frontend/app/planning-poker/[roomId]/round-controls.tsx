import { Button } from '@/components/ui/button';
import { Game, Player, Round } from '@/models';
import React from 'react';
import { useRoundControls } from './use-round-controls';

type Props = {
    player: Player;
    game: Game;
    round: Round;
    setDisplayMetrics?: (value: boolean) => void;
};

export const RoundControls: React.FC<Props> = ({ player, game, round, setDisplayMetrics }) => {
    const { loading, endRound, newRound, endGame } = useRoundControls({ game, round });
    if (!round.inProgress && setDisplayMetrics != null) {
        return (
            <div className='flex flex-wrap justify-center'>
                <Button
                    variant='secondary'
                    size='default'
                    onClick={() => setDisplayMetrics(true)}
                    disabled={loading}
                >
                    Display metrics
                </Button>
            </div>
        );
    }
    if (player.role !== 'owner') {
        return null;
    }
    if (round.inProgress) {
        return (
            <div className='flex flex-wrap justify-center'>
                <Button
                    variant='default'
                    size='default'
                    onClick={endRound}
                    disabled={loading}
                >
                    Reveal
                </Button>
            </div>
        );
    }

    return (
        <div className='flex flex-wrap justify-center gap-4'>
            <div className='flex justify-center gap-4'>
                <Button
                    variant='secondary'
                    size='default'
                    onClick={newRound}
                    disabled={loading}
                >
                    Vote again
                </Button>
                <Button
                    variant='default'
                    size='default'
                    onClick={() => endGame(true)}
                    disabled={loading}
                >
                    Accept vote ({round.medianScore})
                </Button>
                <Button
                    variant='destructive'
                    size='default'
                    onClick={() => endGame(false)}
                    disabled={loading}
                >
                    Reject vote ({round.medianScore})
                </Button>
            </div>
        </div>
    );
};
