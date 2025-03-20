'use client';

import React, { JSX } from 'react';
import { ChatHeader } from '../types/chat-header';
import { useChat } from '../hooks/use-chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronUp, Loader2, Send, X } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useCallback, useEffect } from 'react';
import { useUserDetails } from '@/hooks/use-user-details';
import { User } from '@/models';
import { Message } from '../types/message';

type ChatProps = {
  chatHeader: ChatHeader
  allowClose: boolean
  handleCloseChat: (user: User) => void
}

export function Chat({ chatHeader, allowClose, handleCloseChat }: ChatProps): JSX.Element {
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
        minimized,
        setMinimized,
        getSender,
        messagesEndRef,
    } = useChat({ chatHeader });
    const { userName, initials } = useUserDetails({ user: chatHeader.user });

    let lastMessageDate: string | null = null;

    return (
        <div className='flex flex-col w-72 bg-[background] border border-[foreground] shadow-lg border-b-0 rounded-t-lg'>
            <div className='flex items-center p-2 border-b'>
                <Avatar className='h-8 w-8  rounded-lg'>
                    <AvatarImage src={chatHeader.user.profilePicture} alt={userName} />
                    <AvatarFallback className='rounded-lg text-xs'>{initials}</AvatarFallback>
                </Avatar>
                <span className='ml-2'>{userName}</span>
                <div className='ml-auto'>
                    <Button
                        onClick={() => setMinimized(!minimized)}
                        variant='ghost'
                        size='icon'
                    >
                        <ChevronUp className={`h-4 w-4 transform transition-transform duration-300 ${minimized ? 'rotate-360' : 'rotate-180'}`} />
                    </Button>
                    {allowClose && (
                        <Button
                            onClick={() => handleCloseChat(chatHeader.user)}
                            variant='ghost'
                            size='icon'
                        >
                            <X className='h-4 w-4' />
                        </Button>
                    )}
                </div>
            </div>
            <div className={`flex-1 overflow-hidden transition-all duration-300 ${minimized ? 'max-h-0' : 'max-h-96'}`}>
                <div className='flex-1 p-2 overflow-y-auto h-52'>
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
                    {loading && <Loader2 className='h-10 w-10 animate-spin'/>}
                    <div ref={messagesEndRef} />
                </div>
                <div className='flex p-2 border-t'>
                    <input
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder='Type a message...'
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
                    <p className='text-xs font-bold text-center mb-1'>{createdAt.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            )}
            <div title={getTitle()} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 text-sm`}>
                <div className={`p-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white ml-4' : 'bg-gray-200 text-black mr-4'} ${message.isError ? 'bg-red-800 text-white' : ''}`}>
                    {message.isError && (<p>Error:</p>)}
                    {userName && (<p>{isOwnMessage ? 'You' : userName} - {createdAt?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>)}
                    <p>{message.content}</p>
                </div>
            </div>
        </>
    );
};
