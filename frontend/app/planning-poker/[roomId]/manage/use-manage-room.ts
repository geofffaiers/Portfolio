import { useConfigContext } from "@/components/providers/config-provider";
import { useToastWrapper } from "@/hooks/use-toast-wrapper";
import { DefaultResponse, Player, Room } from "@/models";
import { useCallback, useEffect, useState } from "react";
import { PlayerWrapper } from "./player-wrapper";

type UseManageRoom = {
    showManageRoom: boolean;
    setShowManageRoom: (show: boolean) => void;
    loading: boolean;
    handleUpdateRoom: (data: Data) => Promise<void>;
    tempPlayers: PlayerWrapper[];
    setTempPlayers: (players: PlayerWrapper[]) => void;
};

type Props = {
    room: Room;
};

type Data = {
    name: string;
    description: string;
};

export const useManageRoom = ({ room }: Props): UseManageRoom => {
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const [showManageRoom, setShowManageRoom] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [tempPlayers, setTempPlayers] = useState<PlayerWrapper[]>([]);

    useEffect(() => {
        setTempPlayers(room.players.map((player) => (new PlayerWrapper(player, false, false))));
    }, [room.players]);

    const handleUpdateRoom = useCallback(async (data: Data) => {
        if (tempPlayers.find((p) => p.role === 'owner' && !p.removed) === undefined) {
            displayError('Room must have an owner');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/update-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    roomId: room.id,
                    name: data.name,
                    description: data.description,
                    updatedPlayers: tempPlayers.filter((p) => p.updated),
                    removedPlayers: tempPlayers.filter((p) => p.removed),
                }),
            });
            const json: DefaultResponse = await response.json();
            if (json.success) {
                setShowManageRoom(false);
            } else {
                displayError(json.message ?? 'Failed to update room');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                displayError(err.message);
            } else {
                displayError('Unhandled error');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, room.id, tempPlayers, displayError]);

    return {
        showManageRoom,
        setShowManageRoom,
        loading,
        handleUpdateRoom,
        tempPlayers,
        setTempPlayers,
    };
};
