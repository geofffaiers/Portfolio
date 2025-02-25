import { useConfigContext } from "@/components/providers/config-provider";
import { useSocketContext } from "@/components/providers/socket-provider";
import { useToastWrapper } from "@/hooks/use-toast-wrapper";
import { DefaultResponse, Room, Round } from "@/models";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
    roomId: string;
    setRoomName: (name: string) => void;
};

type UsePlanningPoker = {
    loading: boolean;
    room: Room | null;
    round: Round | null;
    shareRoom: () => void;
    submitVote: (value: string | number) => Promise<void>;
    newGame: (data: Data) => Promise<void>;
    updateGame: (data: Data) => Promise<void>;
};

type Data = {
    id: string;
    name: string;
    description: string;
};

export function usePlanningPoker ({ roomId, setRoomName }: Props): UsePlanningPoker {
    const router = useRouter();
    const { config } = useConfigContext();
    const { displayInfo, displayError } = useToastWrapper();
    const { sendSocketMessage, subscribe, unsubscribe } = useSocketContext()
    const [loading, setLoading] = useState<boolean>(true);
    const [room, setRoom] = useState<Room | null>(null);
    const [round, setRound] = useState<Round | null>(null);
    
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
                setRoom(json.data.room);
                setRoomName(json.data.room.name);
                setLoading(false);
            } else {
                displayError('Room not found');
                router.push('/planning-poker');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                console.error(error);
                displayError('An unexpected error occurred');
            }
            router.push('/planning-poker');
        }
    }, [config.apiUrl, roomId]);
    
    const newGame = useCallback(async (data: Data) => {

    }, []);
    
    const updateGame = useCallback(async (data: Data) => {

    }, []);

    const shareRoom = useCallback(() => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                displayInfo("Room link copied to clipboard!");
            })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                displayError("Failed to copy room link");
            });
    }, [displayInfo, displayError]);

    const submitVote = useCallback(async (value: string | number) => {

    }, []);

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);

    return {
        loading,
        room,
        round,
        shareRoom,
        submitVote,
        newGame,
        updateGame,
    };
}
