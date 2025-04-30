import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Room } from '@/models';
import { Typography } from '@/components/ui/typography';

type Props = {
    rooms: Room[];
    handleJoinRoom: (roomId: string) => Promise<void>;
};

const FormSchema = z.object({
    roomId: z.string({
        required_error: 'Please select a room to join.',
    })
});

export const JoinRoom: React.FC<Props> = ({ handleJoinRoom, rooms }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleJoinRoom(data.roomId);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <Typography variant='h3'>Join an existing room</Typography>
                <FormField
                    control={form.control}
                    name='roomId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Room Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select a room' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {rooms.map((room) => (
                                        <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button type='submit'>Join Room</Button>
                </div>
            </form>
        </Form>
    );
};
