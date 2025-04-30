'use client';

import React, { JSX, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordStrength } from '@/components/ui/password-strength';
import { useAuthContext } from '@/components/providers/auth-provider';

import { useChangePassword } from './use-change-password';

export function ChangePassword(): JSX.Element | null {
    const { user } = useAuthContext();
    const { open, setOpen, loading, handleChangePassword, passwordScore, setPasswordScore } = useChangePassword();

    const FormSchema = useMemo(() => z.object({
        oldPassword: z.string({
            required_error: 'Old password is required.',
        }),
        newPassword: z
            .string({
                required_error: 'New password is required.',
            })
            .superRefine(async (val, ctx) => {
                if (val !== '' && passwordScore < 3) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Password is too weak.',
                    });
                }
            }),
        confirmPassword: z.string({
            required_error: 'Confirm password is required.',
        })
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    }), [passwordScore]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        await handleChangePassword(values.oldPassword, values.newPassword);
    }

    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [form, open]);

    if (user == null) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='secondary'
                    size='default'
                    onClick={() => setOpen(true)}
                >
                    Change password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                        Enter your old password and a new one to change your password.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-6'>
                            <FormField
                                control={form.control}
                                name='oldPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Old password</FormLabel>
                                        <FormControl>
                                            <Input type='password' disabled={loading} required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='newPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <Input type='password' disabled={loading} required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input type='password' disabled={loading} required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <PasswordStrength password={form.watch('newPassword')} setPasswordScore={setPasswordScore}/>
                            <Button type='submit' className='w-full' loading={loading}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
