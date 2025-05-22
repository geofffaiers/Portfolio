'use client';

import React, { JSX } from 'react';
import { ChatHeader } from '../../types/chat-header';
import { useChat } from '../../hooks/use-chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useCallback, useEffect } from 'react';
import { useUserDetails } from '@/hooks/use-user-details';
import { User } from '@/models';
import { Message } from '../../types/message';
import { Typography } from '@/components/ui/typography';
import { useMessagingContext } from '../../context/messaging-provider';

type ChatProps = {
  chatHeader: ChatHeader
}

export function Chat({ chatHeader }: ChatProps): JSX.Element {
    const { user } = useAuthContext();
    const {
        newMessage,
        setNewMessage,
        messages,
        loading,
        hasMore,
        sendMessage,
        readMessage,
        loadMoreMessages,
        getSender,
        messagesEndRef,
    } = useChat({ chatHeader });
    const { setPageChat } = useMessagingContext();
    const { userName, initials } = useUserDetails({ user: chatHeader.user });

    let lastMessageDate: string | null = null;

    return (
        <div className='flex flex-col h-full w-full max-h-full'>
            <div className='flex items-center p-2 border-b'>
                <Avatar className='h-8 w-8  rounded-lg'>
                    <AvatarImage src={chatHeader.user.profilePicture} alt={userName} />
                    <AvatarFallback className='rounded-lg text-xs'>{initials}</AvatarFallback>
                </Avatar>
                <span className='ml-2'>{userName}</span>
                <div className='ml-auto'>
                    <Button
                        onClick={() => setPageChat(null)}
                        variant='ghost'
                        size='icon'
                    >
                        <X className='h-4 w-4' />
                    </Button>
                </div>
            </div>
            <div className='flex-1 overflow-y-auto p-2'>
                {!loading && hasMore && <Button onClick={loadMoreMessages} variant='link'>Load more</Button>}
                {messages.map((msg, index) => {
                    const createdAt: Date = new Date(msg.createdAt ?? new Date());
                    const messageDate = createdAt.toLocaleDateString('en-GB');
                    const showDate = messageDate !== lastMessageDate;
                    lastMessageDate = messageDate;
                    return (
                        <SingleMessage
                            key={`${index}--${msg.id}`}
                            message={msg}
                            isOwnMessage={msg.senderId === user?.id}
                            sender={getSender(msg.senderId)}
                            createdAt={createdAt}
                            showDate={showDate}
                            readMessage={readMessage}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className='flex p-2 border-t shrink-0 bg-background'>
                <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type a message...'
                    autoComplete='new-password' // This is to prevent auto complete
                    className='flex-1 border border-[foreground] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />
                <Button onClick={sendMessage} variant='ghost' size='icon' className='ml-2'>
                    <Send className='h-4 w-4' />
                </Button>
            </div>
        </div>
    );
}

type SingleMessageProps = {
    message: Message
    isOwnMessage: boolean
    sender: User | null
    createdAt: Date
    showDate: boolean
    readMessage: (messageId: number) => void
}

const SingleMessage = ({ message, isOwnMessage, sender, createdAt, showDate, readMessage }: SingleMessageProps) => {
    const { userName } = useUserDetails({ user: sender });

    const getTitle = useCallback((): string => {
        let title = '';
        if (message.isError) {
            title = `Error issued: ${message.createdAt.toLocaleString()}`;
        } else if (message.readAt) {
            title = `Read: ${message.readAt.toLocaleString()}`;
        } else {
            title = 'Unread';
        }
        return title;
    }, [message]);

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
