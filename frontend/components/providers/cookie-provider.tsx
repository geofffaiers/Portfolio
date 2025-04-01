'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '../ui/toast';
import Link from 'next/link';

type Props = {
    consent: boolean;
};

const CookieContext = createContext<Props | undefined>(undefined);

export const CookieProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const [consent, setConsent] = useState<boolean>(false);
    const [hasChecked, setHasChecked] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedConsent = localStorage.getItem('cookie-consent');
            const expirationTime = localStorage.getItem('cookie-consent-expiration');

            if (savedConsent && expirationTime) {
                const isValid = parseInt(expirationTime) > Date.now();

                if (isValid) {
                    setConsent(true);
                } else {
                    localStorage.removeItem('cookie-consent');
                    localStorage.removeItem('cookie-consent-expiration');
                }
            }
            setHasChecked(true);
        }
    }, []);

    useEffect(() => {
        if (hasChecked && !consent) {
            toast({
                title: 'Cookie Consent',
                description: <p>We use cookies to improve your experience. By using our site, you agree to <Link href='/cookies' className='underline'>our use of cookies</Link>.</p>,
                action: <ToastAction
                    altText='Confirm cookies'
                    onClick={() => {
                        const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000);
                        localStorage.setItem('cookie-consent', 'true');
                        localStorage.setItem('cookie-consent-expiration', sevenDaysFromNow.toString());
                        setConsent(true);
                    }}
                >
                    Accept
                </ToastAction>
            });
        }
    }, [hasChecked, consent, toast]);

    return (
        <CookieContext.Provider value={{ consent }}>
            {children}
        </CookieContext.Provider>
    );
};

export const useCookieContext = () => {
    const context = useContext(CookieContext);
    if (context === undefined) {
        throw new Error('useCookieContext must be used within a CookieProvider');
    }
    return context;
};
