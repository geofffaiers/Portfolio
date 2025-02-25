'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { DefaultResponse, User } from '@/models';
import { useConfigContext } from './config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';

type AuthContextProps = {
  authLoading: boolean;
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { displayError } = useToastWrapper();
    const { config } = useConfigContext();
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const refreshToken = useCallback(async (): Promise<string> => {
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        const response = await fetch(`${config.apiUrl}/users/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            signal
        });
        const data: DefaultResponse = await response.json();
        if (data.success) {
            return '';
        }
        return data.message ?? 'Refresh token failed';
    }, [config.apiUrl]);

    useEffect(() => {
        const checkStorage = async () => {
            setAuthLoading(true);
            const savedUser = localStorage.getItem('loggedInUser');
            if (savedUser) {
                const refreshError: string = await refreshToken();
                if (refreshError === '') {
                    setUser(JSON.parse(savedUser));
                } else {
                    localStorage.removeItem('loggedInUser');
                    setUser(null);
                    displayError(refreshError);
                }
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        };

        if (user === undefined) {
            checkStorage();
        }
    }, [user, setUser, displayError, refreshToken]);

    return (
        <AuthContext.Provider value={{ authLoading, user, setUser }}>
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
