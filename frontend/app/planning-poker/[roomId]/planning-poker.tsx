import React, { JSX } from 'react';
import { usePlanningPoker } from './use-planning-poker';
import { Binoculars, Check, Coffee, GraduationCap, Loader2, Share2, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Player, Room, Vote } from '@/models';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useUserDetails } from '@/hooks/use-user-details';

type Props = {
    roomId: string;
    setRoomName: (name: string) => void;
};

export const PlanningPoker: React.FC<Props> = ({ roomId, setRoomName }) => {
    const {
        loading,
        room,
        round,
        shareRoom,
        updateGame,
        newGame,
        submitVote
    } = usePlanningPoker({ roomId, setRoomName });

    return (
        <>
            {loading && (<Loader2 className="animate-spin" />)}
            {!loading && room && (
                <>
                    <Header room={room} shareRoom={shareRoom}/>
                    <div className="flex">
                        <div className="flex-1 me-4">
                            <CurrentRound room={room} />
                        </div>
                        <div className="w-64 hidden md:block">
                            <Rounds room={room} />
                        </div>
                    </div>
                    <Cards submitVote={submitVote} />
                </>
            )}
        </>
    );
};

const Header: React.FC<{ room: Room, shareRoom: () => void }> = ({ room, shareRoom }) => {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-4xl font-bold">Room: {room.name}</h1>
                <p>Description: {room.description}</p>
            </div>
            <Button
                variant="outline"
                size="default"
                onClick={shareRoom}
            >
                Share
                <Share2 />
            </Button>
        </div>
    );
};

const CurrentRound: React.FC<{ room: Room }> = ({ room }) => {
    return (
        <>
            <p className="font-bold mb-2">Current Round</p>
            <Table>
                <TableBody>
                    {room.players?.map((player: Player) => {
                        const { userName } = useUserDetails({ user: player });
                        const title = `${userName} (${player.role.charAt(0).toUpperCase() + player.role.slice(1)}) - ${player.online ? 'Online' : 'Offline'}`;
                        return (
                            <TableRow key={player.id}>
                                <TableCell className="flex gap-2 items-center" title={title}>
                                    {<StatusIcon player={player} />}
                                    <span className="ml-2">{userName}</span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}

const StatusIcon: React.FC<{ player: Player }> = ({ player }) => {
    const color = player.online ? 'text-green-500' : 'text-red-500';
    if (player.role === 'observer') {
        return <Binoculars className={color}/>
    }
    if (player.role === 'player') {
        return <User className={color}/>
    }
    return <GraduationCap className={color}/>
}

const Rounds: React.FC<{ room: Room }> = ({ room }) => {
    return (
        <>
            Rounds
        </>
    )
}

const Cards: React.FC<{ submitVote: (value: string | number) => Promise<void> }> = ({ submitVote }) => {
    return (
        <div className="flex flex-wrap gap-4 justify-center my-auto">
            <Card value={0} submitVote={submitVote}/>
            <Card value={1} submitVote={submitVote}/>
            <Card value={2} submitVote={submitVote}/>
            <Card value={3} submitVote={submitVote}/>
            <Card value={5} submitVote={submitVote}/>
            <Card value={8} submitVote={submitVote}/>
            <Card value={13} submitVote={submitVote}/>
            <Card value={21} submitVote={submitVote}/>
            <Card value={34} submitVote={submitVote}/>
            <Card value={'?'} submitVote={submitVote}/>
            <Card value={'coffee'} submitVote={submitVote}/>
        </div>
    );
}

const Card: React.FC<{ value: string | number, submitVote: (value: string | number) => Promise<void> }> = ({ value, submitVote }) => {
    let label: JSX.Element | string | number = value;
    if (value === 'coffee') {
        label = <Coffee size={40}/>;
    }
    return (
        <div
            className="cursor-pointer w-32 aspect-[2/3] rounded-lg border border-current flex items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:shadow-lg hover:background"
            onClick={() => submitVote(value)}
        >
            <h3 className="text-4xl font-semibold tracking-tight">{label}</h3>
        </div>
    );
}
