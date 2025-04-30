import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, Room } from '@/models';
import { useAuthContext } from '@/components/providers/auth-provider';

type UsePokerLobby = {
    loadingRooms: boolean;
    loadingCreateRoom: boolean;
    rooms: Room[] | undefined;
    handleJoinRoom: (romId: string) => Promise<void>;
    handleCreateRoom: (name: string, description: string) => Promise<void>;
};

export function usePokerLobby(): UsePokerLobby {
    const { config } = useConfigContext();
    const { authReady } = useAuthContext();
    const router = useRouter();
    const { displayError } = useToastWrapper();
    const [loadingRooms, setLoadingRooms] = useState<boolean>(false);
    const [loadingCreateRoom, setLoadingCreateRoom] = useState<boolean>(false);
    const [rooms, setRooms] = useState<Room[] | undefined>(undefined);
    const abortController = useRef<AbortController | null>(null);

    const getRooms = useCallback(async () => {
        if (abortController.current) {
            return;
        }
        abortController.current = new AbortController();
        const signal = abortController.current.signal;
        try {
            setLoadingRooms(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/rooms`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                signal
            });
            const json: DefaultResponse<{ rooms: Room[] }> = await response.json();
            abortController.current = null;
            if (json.success && json.data != null) {
                setRooms(json.data.rooms);
            } else if (json.message) {
                setRooms([]);
                displayError(json.message);
            }
        } catch (error: unknown) {
            setRooms([]);
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred.');
            }
        } finally {
            setLoadingRooms(false);
        }
    }, [config.apiUrl, displayError]);

    const handleJoinRoom = useCallback(async (roomId: string) => {
        router.push(`/planning-poker/${roomId}`);
    }, [router]);

    const handleCreateRoom = useCallback(async (name: string, description: string) => {
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();
        const signal = abortController.current.signal;
        try {
            setLoadingCreateRoom(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, description }),
                signal,
            });
            const json: DefaultResponse<{ room: Room }> = await response.json();
            abortController.current = null;
            if (json.success && json.data != null) {
                handleJoinRoom(json.data.room.id);
            } else if (json.message) {
                displayError(json.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred.');
            }
        } finally {
            setLoadingCreateRoom(false);
        }
    }, [config.apiUrl, displayError, handleJoinRoom]);

    useEffect(() => {
        if (authReady && !loadingRooms && rooms == null) {
            getRooms();
        }
    }, [authReady, loadingRooms, rooms, getRooms]);

    return {
        loadingRooms,
        loadingCreateRoom,
        rooms,
        handleJoinRoom,
        handleCreateRoom,
    };
}
