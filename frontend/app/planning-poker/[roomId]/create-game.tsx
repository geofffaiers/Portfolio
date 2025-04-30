import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Player, Room } from '@/models';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCreateGame } from './use-create-game';

type Props = {
    player: Player;
    room: Room;
};

const FormSchema = z.object({
    name: z.string({
        required_error: 'Game name is required.',
        invalid_type_error: 'Game name must be a string.',
    }).min(3, {
        message: 'Game name must be at least 3 characters.',
    })
});

export const CreateGame: React.FC<Props> = ({ player, room }) => {
    const { saving, createGame } = useCreateGame({ room });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: '' },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        await createGame(values.name);
    }

    const isOwner = player.role === 'owner';

    return (
        <div className='flex h-full w-full items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <div className='flex flex-col gap-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-2xl'>{isOwner ? 'Create Game' : 'Waiting for a game...'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isOwner ? (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}>
                                        <div className='flex flex-col gap-6'>
                                            <FormField
                                                control={form.control}
                                                name='name'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Game name</FormLabel>
                                                        <FormControl>
                                                            <Input required {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type='submit' loading={saving}>
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <Loader2 className='animate-spin align-center' />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
