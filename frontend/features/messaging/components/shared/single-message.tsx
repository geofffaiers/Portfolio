'use client';

import React, { useEffect } from 'react';
import { useUserDetails } from '@/hooks/use-user-details';
import { Typography } from '@/components/ui/typography';
import { Message, User } from '@/models';

type Props = {
    message: Message
    isOwnMessage: boolean
    sender: User | null
    createdAt: Date
    showDate: boolean
    readMessage: (messageId: number) => void
}

export const SingleMessage = ({ message, isOwnMessage, sender, createdAt, showDate, readMessage }: Props) => {
    const { userName } = useUserDetails({ user: sender });

    const getTitle = (): string => {
        let title = '';
        if (message.isError) {
            title = `Error issued: ${message.createdAt.toLocaleString()}`;
        } else if (message.readAt) {
            title = `Read: ${message.readAt.toLocaleString()}`;
        } else {
            title = 'Unread';
        }
        return title;
    };

    useEffect(() => {
        if (!isOwnMessage && !message.readAt) {
            readMessage(message.id);
        }
    }, [isOwnMessage, message.readAt, message.id, readMessage]);

    return (
        <>
            {showDate && (
                <div className='flex justify-center'>
                    <Typography variant='p' className='text-xs font-bold text-center mb-1'>{createdAt.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </div>
            )}
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 text-sm`}>
                <div title={getTitle()} className={`p-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white ml-4' : 'bg-gray-200 text-black mr-4'} ${message.isError ? 'bg-red-800 text-white' : ''}`}>
                    {message.isError && (<Typography variant='p'>Error:</Typography>)}
                    {userName && (<Typography variant='p'>{isOwnMessage ? 'You' : userName} - {createdAt?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</Typography>)}
                    <Typography variant='p'>{message.content}</Typography>
                </div>
            </div>
        </>
    );
};
