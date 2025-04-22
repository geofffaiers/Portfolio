'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { DefaultResponse, User } from '@/models';
import { useConfigContext } from './config-provider';

type AuthContextProps = {
  authLoading: boolean;
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { config } = useConfigContext();
    const [user, setUser] = useState<User | null | undefined>(undefined);
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
                }
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        };

        if (user === undefined) {
            checkStorage();
        } else {
            setAuthLoading(false);
        }
    }, [user, setUser, refreshToken]);

    return (
        <AuthContext.Provider
            value={{
                authLoading,
                user,
                setUser,
                authReady: !authLoading && user != null
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
