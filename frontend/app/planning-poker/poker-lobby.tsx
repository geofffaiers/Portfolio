'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

import { useAuthContext } from '@/components/providers/auth-provider';
import { AccessRestricted } from '@/components/ui/access-restricted';
import { Separator } from '@/components/ui/separator';

import { usePokerLobby } from './use-poker-lobby';
import { NewRoom } from './new-room';
import { JoinRoom } from './join-room';

export const PokerLobby: React.FC = () => {
    const { authLoading, authReady } = useAuthContext();
    return (
        <>
            {authLoading && <Loader2 className='animate-spin' />}
            {authReady
                ? (
                    <AccessGranted />
                )
                : (
                    <AccessRestricted message='To join the Planning Poker session, please sign in or register. A live connection is required to receive real-time updates.'/>
                )
            }
        </>
    );
};

const AccessGranted: React.FC = () => {
    const { rooms, handleJoinRoom, handleCreateRoom } = usePokerLobby();
    return (
        <div className='flex h-full w-full items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <div className='flex flex-col gap-6'>
                    {rooms == null ? (
                        <Loader2 className='mx-auto animate-spin' />
                    ) : (
                        <>
                            {rooms.length > 0 && (
                                <>
                                    <JoinRoom rooms={rooms} handleJoinRoom={handleJoinRoom}/>
                                    <div className='flex items-center'>
                                        <Separator className='flex-grow w-auto' />
                                        <span className='mx-2'>Or</span>
                                        <Separator className='flex-grow w-auto' />
                                    </div>
                                </>
                            )}
                            <NewRoom rooms={rooms} handleCreateRoom={handleCreateRoom}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
