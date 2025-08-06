'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { DefaultResponse, Guest, User } from '@/models';
import { useConfigContext } from './config-provider';

const MS_IN_HOUR = 60 * 60 * 1000;

type AuthContextProps = {
    authLoading: boolean;
    userReady: boolean;
    guestReady: boolean;
    authReady: boolean;
    user: User | null | undefined;
    guest: Guest | null;
    setUser: (user: User | null | undefined) => void;
    handleSetGuest: (ids: number[], guestName: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { config } = useConfigContext();
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(true);

    const refreshToken = useCallback(async (): Promise<string> => {
        const response = await fetch(`${config.apiUrl}/users/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data: DefaultResponse = await response.json();
        if (data.success) {
            return '';
        }
        return data.message ?? 'Refresh token failed';
    }, [config.apiUrl]);

    useEffect(() => {
        let refreshTokenTimerId: NodeJS.Timeout | null = null;

        // This is insecure. I need to investigate a better solution to storing data in localStorage for users and guests

        const checkStorage = async () => {
            setAuthLoading(true);
            const savedUser = localStorage.getItem('loggedInUser');
            if (savedUser) {
                const refreshError: string = await refreshToken();
                if (refreshError === '') {
                    localStorage.removeItem('guestName');
                    setGuest(null);
                    setUser(JSON.parse(savedUser));
                    refreshTokenTimerId = setInterval(refreshToken, MS_IN_HOUR); // Refresh the token every hour
                } else {
                    localStorage.removeItem('loggedInUser');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            const guest = localStorage.getItem('guestName');
            const guestIds = localStorage.getItem('guestIds');
            if (guest && guestIds) {
                setGuest({
                    ids: JSON.parse(guestIds),
                    guestName: guest
                });
                setUser(null);
                localStorage.removeItem('loggedInUser');
            } else {
                setGuest(null);
            }
            setAuthLoading(false);
        };

        if (user === undefined) {
            checkStorage();
        } else {
            setAuthLoading(false);
            refreshTokenTimerId = setInterval(refreshToken, MS_IN_HOUR); // Refresh the token every hour
        }

        return () => {
            if (refreshTokenTimerId) {
                clearInterval(refreshTokenTimerId);
            }
        };
    }, [user, setUser, refreshToken]);

    const handleSetGuest = useCallback((ids: number[], guestName: string) => {
        const newGuest: Guest = { ids, guestName };
        localStorage.setItem('guestIds', JSON.stringify(ids));
        localStorage.setItem('guestName', guestName);
        setGuest(newGuest);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authLoading,
                userReady: !authLoading && user != null,
                guestReady: !authLoading && guest != null,
                authReady: !authLoading && (user != null || guest != null),
                user,
                guest,
                setUser,
                handleSetGuest
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
