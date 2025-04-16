'use client';

import React, { JSX } from 'react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useActiveSessions } from './use-active-sessions';
import { Session } from '@/models';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

export function ActiveSessions(): JSX.Element | null {
    const { user, authLoading } = useAuthContext();
    const { sessions, loading, handleLogOutSession } = useActiveSessions();

    if (user == null && !authLoading) {
        return null;
    }

    return (
        <Card className='flex-1'>
            <CardHeader>Active Sessions</CardHeader>
            <CardContent>
                {loading || authLoading ? (
                    <Loader2 className='animate-spin' />
                ) : (
                    <div className='flex flex-col gap-2'>
                        {sessions.length === 0 ? (
                            <p>No active sessions</p>
                        ) : (
                            <SessionTable sessions={sessions} handleLogOutSession={handleLogOutSession} />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function SessionTable ({ sessions, handleLogOutSession }: { sessions: Session[]; handleLogOutSession: (session: Session) => void; }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-auto'>User Agent</TableHead>
                    <TableHead className='w-auto'>IP Address</TableHead>
                    <TableHead className='w-auto'>Location</TableHead>
                    <TableHead className='text-right'>Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sessions.map((session) => <SessionRow key={`row-${session.id}`} session={session} handleLogOutSession={handleLogOutSession} />)}
            </TableBody>
        </Table>
    );
}

function SessionRow ({ session, handleLogOutSession }: { session: Session; handleLogOutSession: (session: Session) => void; }) {
    return (
        <TableRow>
            <TableCell className={!session.isActive ? 'line-through text-red-500' : ''}>
                {session.thisSession && '(This session) '}{session.userAgent}
            </TableCell>
            <TableCell className={!session.isActive ? 'line-through text-red-500' : ''}>{session.ipAddress}</TableCell>
            <TableCell className={!session.isActive ? 'line-through text-red-500' : ''}>{session.location}</TableCell>
            <TableCell className='text-right'>
                {session.isActive && (
                    <Button
                        variant='outline'
                        size='icon'
                        title='Log out session'
                        onClick={(event) => {
                            event.preventDefault();
                            handleLogOutSession(session);
                        }}
                    >
                        <Trash2 />
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}
