import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, Room } from '@/models';
import { useCallback, useState } from 'react';

type Props = {
    room: Room;
};

type UseCreateGame = {
    saving: boolean;
    createGame: (name: string) => Promise<void>;
};

export const useCreateGame = ({ room }: Props): UseCreateGame => {
    const { displayError } = useToastWrapper();
    const { config } = useConfigContext();
    const [saving, setSaving] = useState<boolean>(false);

    const createGame = useCallback(async (name: string) => {
        setSaving(true);
        try {
            const response = await fetch(`${config.apiUrl}/planning-poker/create-game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    roomId: room.id,
                    name
                }),
            });
            const json: DefaultResponse = await response.json();
            setSaving(false);
            if (!json.success) {
                displayError(json.message ?? 'Failed to create game');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred');
            }
        }
    }, [config.apiUrl, room.id, displayError]);

    return {
        saving,
        createGame,
    };
};
