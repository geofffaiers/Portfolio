import { useCallback, useState } from 'react';

import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, Game, Round } from '@/models';

type UseRoundControls = {
    loading: boolean;
    endRound: () => Promise<void>;
    newRound: () => Promise<void>;
    endGame: (succesS: boolean) => Promise<void>;
};

type Props = {
    game: Game;
    round: Round;
};

export const useRoundControls = ({ game, round }: Props): UseRoundControls => {
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const [loading, setLoading] = useState<boolean>(false);

    const endRound = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/end-round?roundId=${round.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const json: DefaultResponse = await response.json();
            if (!json.success) {
                displayError(json.message ?? 'Failed to reveal votes');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('Failed to reveal votes');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, round.id, displayError]);

    const newRound = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/new-round?gameId=${game.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const json: DefaultResponse = await response.json();
            if (!json.success) {
                displayError(json.message ?? 'Failed to start a new round');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('Failed to start a new round');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, game.id, displayError]);

    const endGame = useCallback(async (success: boolean) => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/planning-poker/end-game?gameId=${game.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ success }),
            });
            const json: DefaultResponse = await response.json();
            if (!json.success) {
                displayError(json.message ?? 'Failed to end the game');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('Failed to end the game');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, game.id, displayError]);

    return {
        loading,
        endRound,
        newRound,
        endGame,
    };
};
