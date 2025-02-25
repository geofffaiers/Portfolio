'use client';

import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export function useToastWrapper() {
    const { toast } = useToast();

    const displayError = useCallback((message: string) => {
        toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
            duration: 7000,
        });
    }, [toast]);

    const displayWarning = useCallback((message: string) => {
        toast({
            title: 'Warning',
            description: message,
            variant: 'warning',
            duration: 7000,
        });
    }, [toast]);

    const displayInfo = useCallback((message: string) => {
        toast({
            title: 'Info',
            description: message,
            variant: 'default',
            duration: 7000,
        });
    }, [toast]);

    return {
        displayInfo,
        displayError,
        displayWarning
    };
}
