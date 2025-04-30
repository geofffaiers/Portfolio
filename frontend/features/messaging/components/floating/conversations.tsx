'use client';

import React, { JSX } from 'react';
import { ChatHeader } from '../../types/chat-header';
import { useConversation } from '../../hooks/use-conversation';
import { Button } from '@/components/ui/button';
import { User } from '@/models';
import { useAuthContext } from '@/components/providers/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserDetails } from '@/hooks/use-user-details';
import { ChevronUp, X } from 'lucide-react';
import { Conversation } from '../shared/conversation';

type Props = {
    chatHeaders: ChatHeader[];
    displayConversations: boolean;
    handleOpenChat: (user: User) => void;
    handleCloseFloatingMessaging: () => void;
};

export function Conversations({ chatHeaders, displayConversations, handleOpenChat, handleCloseFloatingMessaging }: Props): JSX.Element | null {
    const { user } = useAuthContext();
    const { userName, initials } = useUserDetails({ user });
    const { sortedHeaders, expanded, setExpanded } = useConversation({ chatHeaders });

    if (displayConversations === false) {
        return null;
    }

    return (
        <div className='flex flex-col w-72 bg-[background] h-full'>
            <div className='flex items-center px-2 py-1 text-white cursor-pointer hover:bg-gray-600 border border-[foreground] border-b-0 rounded-t-lg' onClick={() => setExpanded(!expanded)}>
                <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={user?.profilePicture} alt={userName} />
                    <AvatarFallback className='rounded-lg text-xs'>{initials}</AvatarFallback>
                </Avatar>
                <span className='ml-2'>Messaging</span>
                <Button className='ml-auto' onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} variant='ghost' size='icon'>
                    <ChevronUp className={`h-4 w-4 transform transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-360'}`} />
                </Button>
                <Button
                    onClick={() => handleCloseFloatingMessaging()}
                    variant='ghost'
                    size='icon'
                >
                    <X className='h-4 w-4' />
                </Button>
            </div>
            <div className={`flex flex-col overflow-y-auto transition-all duration-300 border border-[foreground] border-y-0 ${expanded ? 'max-h-64' : 'max-h-0'}`}>
                {sortedHeaders.length > 0 ? (
                    sortedHeaders.map((chatHeader) => (
                        <Conversation key={chatHeader.user.id} chatHeader={chatHeader} handleOpenChat={handleOpenChat} />
                    ))
                ) : (
                    <span className='p-2 text-white'>No conversations</span>
                )}
            </div>
        </div>
    );
}
