'use client';

import React from 'react';
import { Room } from '@/models';
import { useManageRoom } from './use-manage-room';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { ManagePlayers } from './manage-players';

type Props = {
    room: Room;
}

const FormSchema = z.object({
    name: z.string({
        required_error: 'Room name is required.',
    }),
    description: z.string(),
});

export const ManageRoom: React.FC<Props> = ({ room }) => {
    const { showManageRoom, setShowManageRoom, loading, handleUpdateRoom, tempPlayers, setTempPlayers } = useManageRoom({ room });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: room.name, description: room.description },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        await handleUpdateRoom(values);
    }

    return (
        <Dialog open={showManageRoom} onOpenChange={setShowManageRoom}>
            <DialogTrigger asChild>
                <Button
                    variant='outline'
                    size='default'
                    onClick={() => setShowManageRoom(true)}
                >
                    Manage room
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Planning Poker room</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' disabled={loading} required {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <ManagePlayers tempPlayers={tempPlayers} setTempPlayers={setTempPlayers}/>
                            <Button type='submit' className='w-full' loading={loading}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
