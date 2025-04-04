import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoading = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-background'>
            <Loader2 className='w-16 h-16 animate-spin' />
        </div>
    );
};
