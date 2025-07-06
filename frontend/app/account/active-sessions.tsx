'use client';

import React, { JSX, useCallback } from 'react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveSessions } from './use-active-sessions';
import { Session } from '@/models';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';
import { ConfirmLogout } from './confirm-logout';

export function ActiveSessions(): JSX.Element | null {
    const { user, authLoading } = useAuthContext();
    const {
        sessions,
        loading,
        openConfirmLogout,
        handleLogoutSession,
        setOpenConfirmLogout,
        confirmLogout,
        cancelLogout
    } = useActiveSessions();

    if (user == null && !authLoading) {
        return null;
    }

    return (
        <Card className='flex-1 max-w-full'>
            <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                {loading || authLoading ? (
                    <Loader2 className='animate-spin' />
                ) : (
                    <div className='flex flex-col gap-2'>
                        {sessions.length === 0 ? (
                            <p>No active sessions</p>
                        ) : (
                            <SessionTable sessions={sessions} handleLogoutSession={handleLogoutSession} />
                        )}
                    </div>
                )}
            </CardContent>
            <ConfirmLogout
                open={openConfirmLogout}
                setOpen={setOpenConfirmLogout}
                confirmLogout={confirmLogout}
                cancelLogout={cancelLogout}
            />
        </Card>
    );
}

function SessionTable ({ sessions, handleLogoutSession }: { sessions: Session[]; handleLogoutSession: (session: Session) => void; }) {
    return (
        <div className='w-full max-w-[calc(100vw-4rem)] overflow-x-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[130px]'>
                            <span className='hidden md:inline'>User Agent</span>
                            <span className='md:hidden'>Browser</span>
                        </TableHead>
                        <TableHead className='w-[80px]'>
                            <span className='hidden md:inline'>IP Address</span>
                            <span className='md:hidden'>IP</span>
                        </TableHead>
                        <TableHead className='w-[80px]'>Location</TableHead>
                        <TableHead className='w-[50px]'>
                            <span className='sr-only'>Action</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map((session) => <SessionRow key={`row-${session.id}`} session={session} handleLogoutSession={handleLogoutSession} />)}
                </TableBody>
            </Table>
        </div>
    );
}

function SessionRow ({ session, handleLogoutSession }: { session: Session; handleLogoutSession: (session: Session) => void; }) {
    const { isMobile } = useDeviceBreakpoints();

    const truncateUserAgent = useCallback((userAgent: string) => {
        if (isMobile) {
            const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE)[/\s](\d+)/);
            return match ? match[0] : userAgent.substring(0, 20) + '...';
        }
        return userAgent;
    }, [isMobile]);

    return (
        <TableRow>
            <TableCell className={!session.isActive ? 'line-through text-red-500' : ''}>
                {session.thisSession && '(This session) '}{truncateUserAgent(session.userAgent)}
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
                            handleLogoutSession(session);
                        }}
                    >
                        <LogOut />
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}
