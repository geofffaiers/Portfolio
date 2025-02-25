'use client';

import React, { JSX } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteAccount } from './use-delete-account';
import { useAuthContext } from '@/components/providers/auth-provider';
import { z } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function DeleteAccount(): JSX.Element | null {
    const { user } = useAuthContext();
    const { loading, handleDeleteAccount } = useDeleteAccount();
    const requiredText = useMemo(() => `Delete ${user?.username}`, [user]);

    const FormSchema = useMemo(() => z.object({
        confirmation: z.string({
            required_error: 'Confirmation is required.',
        })
    }).refine((data) => data.confirmation === requiredText, {
        message: 'Confirmation does not match.',
        path: ['confirmation'],
    }), [requiredText]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { confirmation: '' },
    });

    async function onSubmit() {
        await handleDeleteAccount();
    }

    if (user == null) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
            Type &quot;{requiredText}&quot; to confirm.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="confirmation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="destructive" className="w-full" loading={loading}>
                Delete
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
