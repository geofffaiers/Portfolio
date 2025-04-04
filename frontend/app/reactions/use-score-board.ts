import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, Score } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseScoreBoard = {
    loading: boolean;
    globalScores: Score[] | undefined;
    userScores: Score[] | undefined;
    thisScore: Score | undefined;
}

type Props = {
    counter: number;
    score: number;
}

export const useScoreBoard = ({ counter, score }: Props): UseScoreBoard => {
    const { user } = useAuthContext();
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const [loading, setLoading] = useState<boolean>(false);
    const [globalScores, setGlobalScores] = useState<Score[] | undefined>(undefined);
    const [userScores, setUserScores] = useState<Score[] | undefined>(undefined);
    const [thisScore, setThisScore] = useState<Score | undefined>(undefined);
    const lastSavedCounterRef = useRef<number>(-1);
    const lastLoadCounterRef = useRef<number>(-1);
    const saveControllerRef = useRef<AbortController | null>(null);
    const loadControllerRef = useRef<AbortController | null>(null);

    const handleSaveScore = useCallback(async () => {
        if (saveControllerRef.current != null) {
            saveControllerRef.current.abort();
        }
        lastSavedCounterRef.current = counter;
        lastLoadCounterRef.current = counter;
        try {
            const { signal } = saveControllerRef.current = new AbortController();
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/scores`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ score }),
                signal
            });
            saveControllerRef.current = null;
            const json: DefaultResponse<{
            globalScores: Score[]
            userScores: Score[]
            thisScore: Score
          }> = await response.json();
            if (json.success && json.data != null) {
                setGlobalScores(json.data.globalScores);
                setUserScores(json.data.userScores);
                setThisScore(json.data.thisScore);
            } else {
                displayError(json.message ?? 'Failed to get scores');
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
    }, [displayError, config.apiUrl, counter, score]);

    const handleLoadScores = useCallback(async () => {
        if (loadControllerRef.current != null) {
            loadControllerRef.current.abort();
        }
        lastLoadCounterRef.current = counter;
        try {
            const { signal } = loadControllerRef.current = new AbortController();
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/scores`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            });
            loadControllerRef.current = null;
            const json: DefaultResponse<{
                globalScores: Score[]
            }> = await response.json();
            if (json.success && json.data != null) {
                setGlobalScores(json.data.globalScores);
            } else {
                displayError(json.message ?? 'Failed to get scores');
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
    }, [displayError, config.apiUrl, counter]);

    useEffect(() => {
        if (counter === lastSavedCounterRef.current || counter === lastLoadCounterRef.current) return;
        if (user != null) {
            handleSaveScore();
        } else {
            handleLoadScores();
        }
    }, [counter, user, handleSaveScore, handleLoadScores]);

    return {
        loading,
        globalScores,
        userScores,
        thisScore,
    };
};
