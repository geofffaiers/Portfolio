'use client';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, User } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseAccount = {
  saveLoading: boolean
  handleSaveChanges: (data: Data) => Promise<void>
  verifyLoading: boolean
  handleVerify: () => Promise<void>
  timeLeftTillResendEnabled: number
}

type Data = {
  email: string
  username: string
  firstName: string
  lastName: string
}

export function useAccount(): UseAccount {
    const { user, setUser } = useAuthContext();
    const { displayError } = useToastWrapper();
    const { config } = useConfigContext();
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [timeLeftTillResendEnabled, setTimeLeftTillResendEnabled] = useState<number>(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSaveChanges = useCallback(async (data: Data) => {
        if (!user) return;
        const tempUser: User = { ...user, ...data };
        setSaveLoading(true);
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const response = await fetch(`${config.apiUrl}/users/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(tempUser),
                signal
            });
            const json: DefaultResponse<User> = await response.json();
            if (json.success && json.data != null) {
                setUser(json.data);
            } else {
                displayError(`Failed to update user: ${json.message}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(`Failed to update user: ${error.message}`);
            } else {
                displayError('Unexpected error occurred.');
            }
        } finally {
            setSaveLoading(false);
        }
    }, [user, setUser, displayError, config.apiUrl]);

    const handleVerify = useCallback(async (): Promise<void> => {
        if (!user) return;
        setVerifyLoading(true);
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const response = await fetch(`${config.apiUrl}/users/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(user),
                signal
            });
            const json: DefaultResponse = await response.json();
            if (json.success) {
                setTimeLeftTillResendEnabled(60);
            } else {
                displayError(`Failed to resend verification email: ${json.message}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(`Failed to resend verification email: ${error.message}`);
            } else {
                displayError('An unknown error occurred');
            }
        } finally {
            setVerifyLoading(false);
        }
    }, [user, displayError, config.apiUrl]);

    useEffect(() => {
        if (timeLeftTillResendEnabled > 0) {
            const interval = setInterval(() => {
                setTimeLeftTillResendEnabled(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timeLeftTillResendEnabled]);

    return {
        saveLoading,
        handleSaveChanges,
        verifyLoading,
        handleVerify,
        timeLeftTillResendEnabled,
    };
}
