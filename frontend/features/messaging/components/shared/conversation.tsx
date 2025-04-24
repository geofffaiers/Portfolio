import React from 'react';
import { useUserDetails } from '@/hooks/use-user-details';
import { ChatHeader } from '../../types/chat-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/models';
import clsx from 'clsx';

type Props = {
    chatHeader: ChatHeader;
    handleOpenChat: (user: User) => void;
    selected?: boolean
};

export function Conversation({ chatHeader, handleOpenChat, selected = false }: Props) {
    const { userName, initials } = useUserDetails({ user: chatHeader.user });

    return (
        <div
            className={clsx(
                'flex items-center px-2 py-1 cursor-pointer hover:bg-gray-600',
                selected ? 'bg-gray-700' : ''
            )}
            onClick={() => handleOpenChat(chatHeader.user)}
        >
            <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={chatHeader.user.profilePicture} alt={userName} />
                <AvatarFallback className='rounded-lg text-xs'>{initials}</AvatarFallback>
            </Avatar>
            <div className='ml-2'>
                <div className='text-white'>{userName}</div>
                <div className='text-gray-400 text-sm'>{chatHeader.lastMessage?.content}</div>
            </div>
        </div>
    );
}
