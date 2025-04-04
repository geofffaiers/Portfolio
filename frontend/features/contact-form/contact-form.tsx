'use client';

import React, { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useContactMe } from './use-contact-form';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    setComplete?: (complete: boolean) => void;
};

const FormSchema = z.object({
    name: z.string({
        required_error: 'Full name is required.',
        invalid_type_error: 'Full name must be a string.',
    }).min(3, {
        message: 'Full name must be at least 3 characters.',
    }),
    email: z.string({
        required_error: 'Email is required.',
        invalid_type_error: 'Email must be a string.',
    }).email({
        message: 'Email is invalid.',
    }),
    message: z.string({
        required_error: 'Message is required.',
        invalid_type_error: 'Message must be a string',
    }).min(3, {
        message: 'Message must be at least 3 characters.'
    }),
});

export function ContactForm({ setComplete }: Props): JSX.Element {
    const { loading, handleSubmitForm } = useContactMe({ setComplete });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        }
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleSubmitForm(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className='flex flex-col gap-6'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} {...field} required/>
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='message'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' loading={loading}>
                        Send
                        <Send />
                    </Button>
                </div>
            </form>
        </Form>
    );
}
