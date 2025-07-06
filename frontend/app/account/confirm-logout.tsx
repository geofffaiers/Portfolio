'use client';

import React, { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    confirmLogout: () => void;
    cancelLogout: () => void;
}

export function ConfirmLogout({ open, setOpen, confirmLogout, cancelLogout }: Props): JSX.Element {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        Removing this session will log you out of this browser.
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={() => cancelLogout()}>
                    No, keep me logged in
                </Button>
                <Button onClick={() => confirmLogout()} variant='destructive'>
                    Yes, log me out
                </Button>
            </DialogContent>
        </Dialog>
    );
}
