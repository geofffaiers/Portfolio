'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { useLogin } from '@/hooks/use-login';
import { DefaultResponse, User } from '@/models';

type UseRegister = {
  loading: boolean
  passwordScore: number
  handleRegister: (data: Data) => Promise<void>
  setPasswordScore: (value: number) => void
}

type Data = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function useRegister(): UseRegister {
    const { user } = useAuthContext();
    const { displayError } = useToastWrapper();
    const { handleLogin } = useLogin();
    const { config } = useConfigContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordScore, setPasswordScore] = useState<number>(0);
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();

    const handleRegister = useCallback(async (data: Data) => {
        setLoading(true);
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const response = await fetch(`${config.apiUrl}/users/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    username:
          data.username,
                    password: data.password
                }),
                signal
            });
            const json: DefaultResponse<User> = await response.json();
            if (json.success && json.data != null) {
                await handleLogin(data.username, data.password);
            } else {
                displayError(`Failed to update user: ${json.message}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(`Failed to update user: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, handleLogin, displayError]);

    useEffect(() => {
        if (user != null) {
            router.push('/account');
        }
    }, [user, router]);

    return {
        loading,
        passwordScore,
        handleRegister,
        setPasswordScore,
    };
}
