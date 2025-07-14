'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useConfigContext } from '@/components/providers/config-provider';
import { useToast } from '@/hooks/use-toast';
import { DefaultResponse, User } from '@/models';

type UseValidate = {
    error: string
}

type Props = {
    validateToken: string
}

export function useValidate({ validateToken }: Props): UseValidate {
    const router = useRouter();
    const { toast } = useToast();
    const { config } = useConfigContext();
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const getUserForValidateToken = useCallback(async (): Promise<void> => {
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const response = await fetch(`${config.apiUrl}/users/get-user-for-validate-token?validateToken=${validateToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            });
            if (!response.ok) {
                setError('Validate token failed');
                return;
            }
            const json: DefaultResponse<User> = await response.json();
            if (json.success) {
                setUser(json.data);
            } else {
                setError(json.message ?? '');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }, [validateToken, config.apiUrl]);

    const validateEmail = useCallback(async (): Promise<void> => {
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const response = await fetch(`${config.apiUrl}/users/validate-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user?.id, validateToken }),
                signal
            });
            if (!response.ok) {
                setError('Validate token failed');
                return;
            }
            const json: DefaultResponse = await response.json();
            if (json.success) {
                router.push('/');
                toast({
                    title: 'Email validated',
                    description: 'Your email has been validated',
                    variant: 'default',
                });
            } else {
                setError(json.message ?? '');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }, [user, router, toast, validateToken, config.apiUrl]);

    useEffect(() => {
        try {
            if (user == null) {
                getUserForValidateToken();
            } else {
                validateEmail();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }, [user, getUserForValidateToken, validateEmail]);

    return {
        error,
    };
}
