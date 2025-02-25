import { useAuthContext } from '@/components/providers/auth-provider';
import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, User } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseLogin = {
  loggingIn: boolean;
  handleLogin: (username: string, password: string) => Promise<void>;
}

export function useLogin(): UseLogin {
    const { displayError } = useToastWrapper();
    const { config } = useConfigContext();
    const { setUser } = useAuthContext();
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleLogin = useCallback(async (username: string, password: string) => {
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        try {
            setLoggingIn(true);
            const response = await fetch(`${config.apiUrl}/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                signal
            });
            const json: DefaultResponse<User> = await response.json();
            setLoggingIn(false);
            if (json.success) {
                const u: User = json.data;
                localStorage.setItem('loggedInUser', JSON.stringify(u));
                setUser(u);
            } else {
                displayError(json.message ?? 'Login failed');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(error.message);
            } else {
                displayError('An unexpected error occurred');
            }
        }
    }, [setUser, displayError, config.apiUrl]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current != null) {
                abortControllerRef.current.abort('Component unmounted');
            }
        };
    }, []);

    return {
        loggingIn,
        handleLogin,
    };
}
