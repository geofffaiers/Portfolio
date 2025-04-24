'use client';

import React, { JSX } from 'react';
import { ChatHeader } from '../../types/chat-header';
import { useConversation } from '../../hooks/use-conversation';
import { User } from '@/models';
import { Conversation } from '../shared/conversation';

type Props = {
  chatHeaders: ChatHeader[];
  openChat: ChatHeader | undefined;
  setPageChat: (user: User | null) => void;
}

export function Conversations({ chatHeaders, openChat, setPageChat }: Props): JSX.Element | null {
    const { sortedHeaders } = useConversation({ chatHeaders });

    return (
        <div className='flex flex-col h-full border border-[foreground] border-y-0 border-l-0 w-full md:w-72'>
            <div className={'flex flex-col overflow-y-auto'}>
                {sortedHeaders.length > 0 ? (
                    sortedHeaders.map((chatHeader) => (
                        <Conversation key={chatHeader.user.id} chatHeader={chatHeader} handleOpenChat={setPageChat} selected={chatHeader.user.id === openChat?.user?.id} />
                    ))
                ) : (
                    <span className='p-2 text-white'>No conversations</span>
                )}
            </div>
        </div>
    );
}
