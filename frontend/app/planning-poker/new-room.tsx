import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Room } from '@/models';
import { Typography } from '@/components/ui/typography';

type Props = {
    rooms: Room[];
    handleCreateRoom: (name: string, description: string) => Promise<void>
};

export const NewRoom: React.FC<Props> = ({ rooms, handleCreateRoom }) => {
    const FormSchema = useMemo(() => z.object({
        name: z.string({
            required_error: 'Please enter a room name.',
        }).min(2, {
            message: 'Room name must be at least 2 characters.',
        })
            .superRefine(async (val, ctx) => {
                if (val !== '' && rooms.find(r => r.name === val)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Room name is already taken.',
                    });
                }
            }),
        description: z.string(),
    }), [rooms]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            description: '',
        }
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleCreateRoom(data.name, data.description);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <Typography variant='h3'>Create a new room</Typography>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Room Name</FormLabel>
                            <FormControl>
                                <Input {...field} required/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Room Description</FormLabel>
                            <FormControl>
                                <Textarea {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button type='submit'>Create Room</Button>
                </div>
            </form>
        </Form>
    );
};
