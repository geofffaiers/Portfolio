import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse } from '@/models';
import { useCallback, useRef, useState } from 'react';

type UseContactMe = {
  open: boolean
  setOpen: (open: boolean) => void
  loading: boolean
  handleSubmitForm: (data: Data) => Promise<void>
}

type Data = {
  name: string
  email: string
  message: string
}

export function useContactMe(): UseContactMe {
    const { config } = useConfigContext();
    const { displayError, displayInfo } = useToastWrapper();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSubmitForm = useCallback(async (data: Data) => {
        setLoading(true);
        try {
            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            const response = await fetch(`${config.apiUrl}/messaging/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
                signal,
            });
            const json: DefaultResponse = await response.json();
            if (json.success) {
                setOpen(false);
                displayInfo('Message sent successfully.');
            } else {
                displayError(`Failed to send message: ${json.message}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                displayError(`Failed to send message: ${error.message}`);
            } else {
                displayError('Unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }, [config.apiUrl, displayError]);

    return {
        open,
        setOpen,
        loading,
        handleSubmitForm,
    };
}
