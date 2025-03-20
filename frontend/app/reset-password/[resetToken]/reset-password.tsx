'use client';

import React, { JSX } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useResetPassword } from './use-reset-password';
import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  resetToken: string
}

export function ResetPassword({ resetToken }: Props): JSX.Element {
    const router = useRouter();
    const {
        error,
        loading,
        saving,
        passwordScore,
        setPasswordScore,
        handleResetPassword,
    } = useResetPassword({ resetToken });

    const FormSchema = useMemo(() => z.object({
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
        defaultValues: { newPassword: '', confirmPassword: '' },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        await handleResetPassword(values.newPassword);
    }

    if (loading) {
        return <Loader2 className='animate-spin' />;
    }

    if (error !== '') {
        return (
            <>
                <p>{error}</p>
                <Button onClick={() => router.push('/login')}>Return to login</Button>
            </>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-6'>
                    <FormField
                        control={form.control}
                        name='newPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                    <Input type='password' required {...field} />
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
                                    <Input type='password' required {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <PasswordStrength password={form.watch('newPassword')} setPasswordScore={setPasswordScore}/>
                    <Button type='submit' className='w-full' loading={saving}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
}
