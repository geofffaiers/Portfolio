'use client';

import React, { JSX, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/components/providers/auth-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { useAccount } from './use-account';

const FormSchema = z.object({
    username: z.string({
        required_error: 'Username is required.',
        invalid_type_error: 'Username must be a string.',
    }).min(3, {
        message: 'Username must be at least 3 characters.',
    }),
    email: z.string({
        required_error: 'Email is required.',
        invalid_type_error: 'Email must be a string.',
    }).email({
        message: 'Email is invalid.',
    }),
    firstName: z.string({
        invalid_type_error: 'First Name must be a string.',
    }).min(3, {
        message: 'First Name must be at least 3 characters.',
    }),
    lastName: z.string({
        invalid_type_error: 'Last Name must be a string.',
    }).min(3, {
        message: 'Last Name must be at least 3 characters.',
    }),
});

export function Account(): JSX.Element {
    const { user } = useAuthContext();
    const { saveLoading, handleSaveChanges, verifyLoading, handleVerify, timeLeftTillResendEnabled } = useAccount();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: user?.username ?? '',
            email: user?.email ?? '',
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
        },
    });

    useEffect(() => {
        if (user != null) {
            form.reset({
                username: user.username,
                email: user.email,
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
            });
        }
    }, [form, user]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleSaveChanges(data);
    }

    if (user == null) {
        return <Loader2 className='animate-spin' />;
    }

    return (
        <>
            <div className='flex flex-col gap-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-6'>
                            <FormField
                                control={form.control}
                                name='username'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex justify-between'>
                                            <span>Email</span>
                                            {user.verifiedEmail ? (
                                                <FontAwesomeIcon icon={faCheckCircle} className='text-green-500' title='Verified'/>
                                            ) : (
                                                <FontAwesomeIcon icon={faTimesCircle} className='text-red-500' title='Not verified'/>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='firstName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='lastName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='w-full' disabled={saveLoading}>
                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            {user?.verifiedEmail === false && (
                <Button
                    variant='secondary'
                    onClick={handleVerify}
                    disabled={verifyLoading || timeLeftTillResendEnabled > 0}
                >
          Resend Verification Email{timeLeftTillResendEnabled > 0 && ` (${timeLeftTillResendEnabled})`}
                </Button>
            )}
        </>
    );
}
