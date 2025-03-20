import { useCallback } from "react";
import { PlayerWrapper } from "./player-wrapper";
import { Role } from "@/models/planning-poker/role";

type UseManagePlayers = {
    handleUpdatePlayer: (player: PlayerWrapper, option: string) => void;
    handleRemovePlayer: (player: PlayerWrapper) => void;
};

type Props = {
    tempPlayers: PlayerWrapper[];
    setTempPlayers: (players: PlayerWrapper[]) => void;
};

export const useManagePlayers = ({ tempPlayers, setTempPlayers }: Props): UseManagePlayers => {
    const handleUpdatePlayer = useCallback((player: PlayerWrapper, option: string) => {
        const updatedPlayers = tempPlayers.map((tempPlayer) => {
            if (tempPlayer.id === player.id) {
                return {
                    ...tempPlayer,
                    role: option as Role,
                    updated: true,
                };
            }
            return tempPlayer;
        });
        setTempPlayers(updatedPlayers);
    }, [tempPlayers, setTempPlayers]);

    const handleRemovePlayer = useCallback((player: PlayerWrapper) => {
        const updatedPlayers = tempPlayers.map((tempPlayer) => {
            if (tempPlayer.id === player.id) {
                return {
                    ...tempPlayer,
                    removed: !tempPlayer.removed,
                };
            }
            return tempPlayer;
        });
        setTempPlayers(updatedPlayers);
    }, [tempPlayers, setTempPlayers]);

    return {
        handleUpdatePlayer,
        handleRemovePlayer,
    };
};
