'use client';

import React, { JSX, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContactForm } from '@/features/contact-form';

export function ContactDialog(): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);

    const setComplete = useCallback((complete: boolean) => {
        setOpen(!complete);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='default'
                    size='lg'
                    onClick={() => setOpen(true)}
                >
                    Contact me
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact Me</DialogTitle>
                    <DialogDescription>
                        Please enter your email and a message, I will aim to get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <ContactForm setComplete={setComplete} />
            </DialogContent>
        </Dialog>
    );
}
