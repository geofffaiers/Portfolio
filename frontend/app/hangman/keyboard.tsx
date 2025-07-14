'use client';

import React from 'react';

import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { KeyboardLayout } from './types';

type Props = {
    letters: KeyboardLayout;
    guessedLetters: string[];
    guessLetter: (letter: string) => void;
}

export const Keyboard: React.FC<Props> = ({ letters, guessedLetters, guessLetter }) => {
    const { isMobile, isTablet } = useDeviceBreakpoints();
    return (
        <div className={cn('mt-auto flex flex-col items-center',
            isMobile || isTablet ? 'gap-1' : 'gap-2',
        )}>
            {letters.map((row, rowIndex) => {
                return (
                    <div
                        key={`row-index--${rowIndex}`}
                        className={cn('flex justify-center',
                            isMobile || isTablet ? 'gap-1' : 'gap-2',
                        )}
                    >
                        {row.map(({ letter }) => {
                            const guessed = guessedLetters.includes(letter);
                            return (
                                <Button
                                    variant={guessed ? 'ghost' : 'outline'}
                                    key={letter}
                                    onClick={() => guessLetter(letter)}
                                    disabled={guessed}
                                    className={cn(
                                        'p-0',
                                        isMobile && 'w-8 h-8',
                                        isTablet && 'w-12 h-12',
                                        !isMobile && !isTablet && 'w-24 h-24',
                                    )}
                                >
                                    {letter.toUpperCase()}
                                </Button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
