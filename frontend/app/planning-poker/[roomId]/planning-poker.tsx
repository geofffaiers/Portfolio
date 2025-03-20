import React from 'react';
import { usePlanningPoker } from './use-planning-poker';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Game, Player, Room } from '@/models';
import { Cards } from './cards';
import { CreateGame } from './create-game';
import { CurrentRound } from './current-round';
import { ManageRoom } from './manage/manage-room';

type Props = {
    roomId: string;
    setRoomName: (name: string) => void;
};

export const PlanningPoker: React.FC<Props> = ({ roomId, setRoomName }) => {
    const {
        loading,
        player,
        room,
        game,
        round,
    } = usePlanningPoker({ roomId, setRoomName });

    return (
        <>
            {loading && (<Loader2 className='animate-spin' />)}
            {!loading && player && room && (
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-full h-full max-w-[calc(100vh)] flex flex-col gap-4'>
                        <Header player={player} room={room} game={game}/>
                        {game && round && <CurrentRound player={player} room={room} game={game} round={round}/>}
                        {!game && <CreateGame player={player} room={room}/>}
                        {player.role !== 'observer' && round && <Cards round={round}/>}
                    </div>
                </div>
            )}
        </>
    );
};

const Header: React.FC<{ player: Player; room: Room, game: Game | null }> = ({ player, room, game }) => {
    if (!room.description && game == null) {
        return null;
    }
    return (
        <div className='flex flex-row gap-4 items-top'>
            <div className='flex flex-col gap-2 w-full'>
                {room.description != null && room.description !== '' && (<h3 className='w-full'>{room.description}</h3>)}
                <div className='flex flex-row gap-2 items-center w-full'>
                    {game != null && (<span>{game.name}</span>)}
                    {game != null && game.rounds.length > 0 && (<span className='[&>svg]:w-3.5 [&>svg]:h-3.5'><ChevronRight /></span>)}
                    {game != null && game.rounds.length > 0 && (<span>Round {game.rounds.length}</span>)}
                </div>
            </div>
            {player.role === 'owner' && (<ManageRoom room={room}/>)}
        </div>
    );
};
