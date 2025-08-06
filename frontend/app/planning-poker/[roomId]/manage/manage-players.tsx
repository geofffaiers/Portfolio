'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserDetails } from '@/hooks/use-user-details';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Role } from '@/models/planning-poker/role';

import { useManagePlayers } from './use-manage-players';
import { PlayerWrapper } from './player-wrapper';

type Props = {
    tempPlayers: PlayerWrapper[];
    setTempPlayers: (players: PlayerWrapper[]) => void;
}

const roleOptions: Role[] = ['observer', 'player', 'owner'];

export const ManagePlayers: React.FC<Props> = ({ tempPlayers, setTempPlayers }) => {
    const { handleUpdatePlayer, handleRemovePlayer } = useManagePlayers({ tempPlayers, setTempPlayers });
    return (
        <div className='max-h-[400px] overflow-y-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-auto'>Player</TableHead>
                        <TableHead className='w-[125px]'>Role</TableHead>
                        <TableHead className='text-right'>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tempPlayers.map((player) => <ManagePlayer
                        key={`row-${player.id}`}
                        player={player}
                        handleUpdatePlayer={handleUpdatePlayer}
                        handleRemovePlayer={handleRemovePlayer}
                    />)}
                </TableBody>
            </Table>
        </div>
    );
};

type ManagePlayerProps = {
    player: PlayerWrapper;
    handleUpdatePlayer: (player: PlayerWrapper, option: string) => void;
    handleRemovePlayer: (player: PlayerWrapper) => void;
};

const ManagePlayer: React.FC<ManagePlayerProps> = ({ player, handleUpdatePlayer, handleRemovePlayer }) => {
    const isGuest = !player.user;
    const { userName } = useUserDetails({ user: player.user });


    let displayText = userName ?? player.guestName ?? 'Guest';
    if (!isGuest) {
        displayText += ` (${player.user?.username})`;
    }

    return (
        <TableRow>
            <TableCell className={player.removed ? 'line-through text-red-500' : ''}>{displayText}</TableCell>
            <TableCell className='w-[125px]'>
                <Select onValueChange={(option) => handleUpdatePlayer(player, option)} defaultValue={player.role} disabled={player.removed}>
                    <SelectTrigger className='w-full'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {roleOptions.map((r) => (
                            <SelectItem key={`item-${r}`} value={r} disabled={isGuest && r === 'owner'}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell className='text-right'>
                <Button
                    variant='outline'
                    size='icon'
                    title={`${player.removed ? 'Restore' : 'Delete'} player`}
                    onClick={(event) => {
                        event.preventDefault();
                        handleRemovePlayer(player);
                    }}
                >
                    <Trash2 />
                </Button>
            </TableCell>
        </TableRow>
    );
};
