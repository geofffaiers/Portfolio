'use client';

import React, { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useForgotPassword } from './use-forgot-password';

const FormSchema = z.object({
    email: z.string({
        required_error: 'Email is required.',
        invalid_type_error: 'Email must be a string.',
    }).email({
        message: 'Email is invalid.',
    })
});

export function ForgotPassword(): JSX.Element {
    const { loading, open, setOpen, handleForgotPassword } = useForgotPassword();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleForgotPassword(data.email);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='link'
                    size='default'
                    onClick={() => setOpen(true)}
                    tabIndex={0}
                    className='px-0'
                >
                    Forgot your password?
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Please enter your email address, we&apos;ll email you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-2'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} required tabIndex={1} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type='submit' className='w-full' loading={loading} tabIndex={3}>
                                Send email
                                <Send />
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
