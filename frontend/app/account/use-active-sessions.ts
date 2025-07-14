'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, Session } from '@/models';

type UseActiveSessions = {
    loading: boolean;
    sessions: Session[];
    openConfirmLogout: boolean;
    handleLogoutSession: (session: Session) => void;
    setOpenConfirmLogout: (open: boolean) => void;
    confirmLogout: () => Promise<void>;
    cancelLogout: () => void;
};

export function useActiveSessions(): UseActiveSessions {
    const { authReady, setUser } = useAuthContext();
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openConfirmLogout, setOpenConfirmLogout] = useState<boolean>(false);
    const [sessionToLogout, setSessionToLogout] = useState<Session | null>(null);

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
        if (authReady) {
            fetchSessions();
        }
    }, [authReady, fetchSessions]);

    const handleLogoutSession = async (session: Session) => {
        if (session.thisSession) {
            setSessionToLogout(session);
            setOpenConfirmLogout(true);
            return;
        }
        await logoutSession(session);
    };

    const logoutSession = async (session: Session) => {
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
                const receivedSessions = json.data.sessions;
                setSessions(receivedSessions);
                if (receivedSessions.length === 0 || !receivedSessions.find((s) => s.thisSession)) {
                    setUser(null);
                }
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
    };

    const confirmLogout = async () => {
        if (sessionToLogout == null) {
            setOpenConfirmLogout(false);
            return;
        }
        await logoutSession(sessionToLogout);
        setSessionToLogout(null);
        setOpenConfirmLogout(false);
    };

    const cancelLogout = () => {
        setOpenConfirmLogout(false);
    };

    return {
        loading,
        sessions,
        openConfirmLogout,
        handleLogoutSession,
        setOpenConfirmLogout,
        confirmLogout,
        cancelLogout,
    };
}
