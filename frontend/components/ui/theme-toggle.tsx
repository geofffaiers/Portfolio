'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = ({ isWrapped = true }: { isWrapped?: boolean }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const isDark = resolvedTheme === 'dark';

    const button = (
        <Button
            variant='outline'
            size='icon'
            aria-label='Toggle theme'
            className='h-7 w-7 border-none'
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            <span className='sr-only'>Switch to {isDark ? 'light' : 'dark'} mode</span>
            {isDark ? <Sun /> : <Moon />}
        </Button>
    );

    return isWrapped ? (
        <div className='flex items-end gap-2 px-4 ml-auto'>{button}</div>
    ) : (
        button
    );
};
