'use client';

import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, Session } from '@/models';
import { useCallback, useEffect, useState } from 'react';

type UseActiveSessions = {
    loading: boolean;
    sessions: Session[];
    handleLogOutSession: (session: Session) => void;
};

export function useActiveSessions(): UseActiveSessions {
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/users/sessions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            setLoading(true);
            const json: DefaultResponse<{ sessions: Session[] }> = await response.json();
            if (json.success && json.data != null) {
                setSessions(json.data.sessions);
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
    }, [config.apiUrl, displayError]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const handleLogOutSession = useCallback(async (session: Session) => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/users/sessions/${session.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            setLoading(true);
            const json: DefaultResponse<{ sessions: Session[] }> = await response.json();
            if (json.success && json.data != null) {
                setSessions(json.data.sessions);
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
    }, [config.apiUrl, displayError]);

    return { loading, sessions, handleLogOutSession };
}
