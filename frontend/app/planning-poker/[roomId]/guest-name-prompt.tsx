import React from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Typography } from '@/components/ui/typography';

type Props = {
    setGuestName: (guestName: string) => void;
};

const FormSchema = z.object({
    guestName: z.string({
        required_error: 'Guest name is required.',
        invalid_type_error: 'Guest name must be a string.',
    })
});

export const GuestNamePrompt = ({ setGuestName }: Props) => {
    const currentPath = usePathname();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            guestName: ''
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setGuestName(data.guestName);
    }

    return (
        <div className='flex h-full w-full items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <div className='flex flex-col gap-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-2xl'>Join Planning Poker room</CardTitle>
                            <CardDescription>
                                Enter your name below to join as a guest, or login to join as a registered user.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className='flex flex-col gap-6'>
                                        <div className='grid gap-2'>
                                            <FormField
                                                control={form.control}
                                                name='guestName'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Guest Name</FormLabel>
                                                        <FormControl>
                                                            <Input required tabIndex={0} {...field} autoFocus/>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type='submit' className='w-full' tabIndex={0}>
                                        Join as Guest
                                        </Button>
                                        <Typography className='text-sm text-muted-foreground mt-2'>
                                        You can also login to join as a registered user.
                                        </Typography>
                                        <Button type='button' className='w-full' tabIndex={0} asChild>
                                            <Link href={`/login?returnUrl=${encodeURIComponent(currentPath)}`}>
                                                <LogIn />
                                                <span>Login / Sign up</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
