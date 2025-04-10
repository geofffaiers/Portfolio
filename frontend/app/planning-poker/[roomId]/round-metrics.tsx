import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableHead, TableRow } from '@/components/ui/table';
import { Game, Player, Round } from '@/models';
import { RoundControls } from './round-controls';

type Props = {
    displayMetrics: boolean;
    setDisplayMetrics: (value: boolean) => void;
    player: Player;
    game: Game;
    round: Round;
};

export const RoundMetrics: React.FC<Props> = ({ displayMetrics, setDisplayMetrics, player, game, round }) => {
    return (
        <Dialog open={displayMetrics} onOpenChange={setDisplayMetrics}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{game.name}</DialogTitle>
                    <DialogDescription>
                        Round {game.rounds.length + 1} metrics
                    </DialogDescription>
                </DialogHeader>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>Total votes</TableHead>
                            <TableHead>{round.votes.filter(v => v.value != null).length}</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Different scores</TableHead>
                            <TableHead>{round.countOfDifferentScores}</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Median score</TableHead>
                            <TableHead>{round.medianScore}</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Mean score</TableHead>
                            <TableHead>{round.meanScore}</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Mode score</TableHead>
                            <TableHead>{round.modeScore}</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Highest score</TableHead>
                            <TableHead>{parseInt(`${round.highestScore}`)}</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead>Lowest score</TableHead>
                            <TableHead>{parseInt(`${round.lowestScore}`)}</TableHead>
                        </TableRow>
                    </TableBody>
                </Table>
                {player.role === 'owner' ? (
                    <RoundControls player={player} game={game} round={round}/>
                ) : (
                    <p>Waiting on game owner</p>
                )}
            </DialogContent>
        </Dialog>
    );
};
