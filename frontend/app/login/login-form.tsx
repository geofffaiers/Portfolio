'use client';

import React, { JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { useLogin } from '@/hooks/use-login';
import Link from 'next/link';
import { ForgotPassword } from './forgot-password';

const FormSchema = z.object({
    username: z.string({
        required_error: 'Username is required.',
        invalid_type_error: 'Username must be a string.',
    }),
    password: z.string({
        required_error: 'Password is required.',
        invalid_type_error: 'Password must be a string.',
    })
});

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>): JSX.Element {
    const { handleLogin, loggingIn } = useLogin();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleLogin(data.username, data.password);
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>Login</CardTitle>
                    <CardDescription>
                        Enter your credentials below to login
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-6'>
                                <div className='grid gap-2'>
                                    <FormField
                                        control={form.control}
                                        name='username'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loggingIn} required tabIndex={0} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='grid gap-2'>
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='flex items-center'>
                                                    <FormLabel>Password</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Input type='password' disabled={loggingIn} required tabIndex={0} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type='submit' className='w-full' loading={loggingIn} tabIndex={0}>
                                    Login
                                    <LogIn />
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <ForgotPassword />
                    <div className='mt-4 text-center text-sm'>
                        Don&apos;t have an account?{' '}
                        <Link href='/register' className='underline underline-offset-4' tabIndex={0}>
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
