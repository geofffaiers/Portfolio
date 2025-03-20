'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useSocketContext } from '@/components/providers/socket-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { BaseMessage, DefaultResponse, Game, MessageType, Player, Room, Round, UpdatedGame, UpdatedRoom, UpdatedRound } from '@/models';
import { UpdatedPlayers } from '@/models/sockets/planning-poker/updated-players';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
    roomId: string;
    setRoomName: (name: string) => void;
};

type UsePlanningPoker = {
    loading: boolean;
    player: Player | null;
    room: Room | null;
    game: Game | null;
    round: Round | null;
};

export function usePlanningPoker ({ roomId, setRoomName }: Props): UsePlanningPoker {
    const router = useRouter();
    const { user } = useAuthContext();
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const { subscribe, unsubscribe } = useSocketContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [room, setRoom] = useState<Room | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [round, setRound] = useState<Round | null>(null);
    const subscriptions = useRef<number[]>([]);

    const populateState = useCallback(async (room: Room, joinRoomHandler?: () => Promise<void>) => {
        if (user == null) {
            return;
        }
        setRoom(room);
        setRoomName(room.name);
        const player: Player | undefined = room.players
            .filter((p) => p.roomId === room.id)
            .find((p) => p.id === user.id);
        if (player) {
            setPlayer(player);
            const game: Game | undefined = room.games
                .filter((g) => g.roomId === room.id)
                .find((g) => g.inProgress);
            if (game) {
                setGame(game);
                const round: Round | undefined = game.rounds
                    .filter((r) => r.roomId === room.id)
                    .find((r) => r.inProgress);
                if (round) {
                    setRound(round);
                } else {
                    setRound(game.rounds[game.rounds.length - 1]);
                }
            }
        } else if (joinRoomHandler != null) {
            await joinRoomHandler();
        } else {
            displayError('Failed to join room');
            router.push('/planning-poker');
        }
    }, [user, setRoomName, router, displayError]);

    const joinRoom = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/join-room?roomId=${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const json: DefaultResponse<{ room: Room }> = await response.json();
            if (json.success && json.data) {
                populateState(json.data.room);
            } else {
                displayError(json.message || 'Failed to join room');
                router.push('/planning-poker');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, displayError, populateState, roomId, router]);

    const fetchRoom = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/room?roomId=${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const json: DefaultResponse<{ room: Room }> = await response.json();
            if (json.success && json.data) {
                populateState(json.data.room, joinRoom);
            } else {
                displayError(json.message || 'Failed to load room');
                router.push('/planning-poker');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred');
            }
            router.push('/planning-poker');
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, roomId, joinRoom, displayError, populateState, router]);

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);

    const handleUpdateRoom = useCallback(async (socketMessage: BaseMessage) => {
        try {
            const updatedRoom = plainToInstance(UpdatedRoom, socketMessage, { excludeExtraneousValues: true });
            await validateOrReject(updatedRoom);
            populateState(updatedRoom.room);
        } catch (err: unknown) {
            if (err instanceof Error) {
                displayError(err.message);
            } else {
                displayError('An unknown error occurred');
            }
        }
    }, [displayError, populateState]);

    const handleUpdatePlayers = useCallback(async (socketMessage: BaseMessage) => {
        try {
            const updatedPlayers = plainToInstance(UpdatedPlayers, socketMessage, { excludeExtraneousValues: true });
            await validateOrReject(updatedPlayers);
            const playersForRoom = updatedPlayers.players
                .filter((p) => p.roomId === room?.id)
            if (playersForRoom.length === 0) {
                return;
            }
            setRoom((room) => {
                if (room) {
                    room.players = playersForRoom;
                    const player: Player | undefined = room.players.find((p) => p.id === user?.id);
                    if (player) {
                        setPlayer(player);
                    }
                }
                return room;
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                displayError(err.message);
            } else {
                displayError('An unknown error occurred');
            }
        }
    }, [displayError, user, room]);

    const handleUpdateGame = useCallback(async (socketMessage: BaseMessage) => {
        try {
            const updatedGame = plainToInstance(UpdatedGame, socketMessage, { excludeExtraneousValues: true });
            await validateOrReject(updatedGame);
            if (updatedGame.game.roomId !== room?.id) {
                return;
            }
            if (updatedGame.game.inProgress) {
                setGame(updatedGame.game);
                const round: Round | undefined = updatedGame.game.rounds
                    .filter((r) => r.roomId === room?.id)
                    .find((r) => r.inProgress);
                if (round) {
                    setRound(round);
                } else {
                    setRound(updatedGame.game.rounds[updatedGame.game.rounds.length - 1]);
                }
            } else {
                setGame(null);
                setRound(null);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                displayError(err.message);
            } else {
                displayError('An unknown error occurred');
            }
        }
    }, [displayError, room]);

    const handleUpdateRound = useCallback(async (socketMessage: BaseMessage) => {
        try {
            const updatedRound = plainToInstance(UpdatedRound, socketMessage, { excludeExtraneousValues: true });
            await validateOrReject(updatedRound);
            if (updatedRound.round.roomId !== room?.id) {
                return;
            }
            setRound(updatedRound.round);
        } catch (err: unknown) {
            if (err instanceof Error) {
                displayError(err.message);
            } else {
                displayError('An unknown error occurred');
            }
        }
    }, [displayError, room]);


    useEffect(() => {
        const subs = subscriptions.current;
        subs.push(
            subscribe(MessageType.UPDATED_ROOM, handleUpdateRoom),
            subscribe(MessageType.UPDATED_PLAYERS, handleUpdatePlayers),
            subscribe(MessageType.UPDATED_GAME, handleUpdateGame),
            subscribe(MessageType.UPDATED_ROUND, handleUpdateRound),
        );
        return () => {
            subs.forEach((id) => {
                unsubscribe(id);
            });
        };
    }, [room, subscribe, unsubscribe, handleUpdateRoom, handleUpdateGame, handleUpdateRound, handleUpdatePlayers]);

    useEffect(() => {
        let hasDisconnected = false;

        const disconnect = () => {
            if (!hasDisconnected && user?.id && roomId) {
                navigator.sendBeacon(`${config.apiUrl}/planning-poker/disconnect`, JSON.stringify({ roomId, userId: user.id }));
                hasDisconnected = true;
            }
        };

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            disconnect();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            disconnect();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [config.apiUrl, roomId, user?.id]);

    return {
        loading,
        player,
        room,
        game,
        round,
    };
}
