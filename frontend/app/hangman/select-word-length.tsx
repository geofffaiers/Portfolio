import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    wordLength: number;
    setWordLength: (wordLength: number) => void;
    restartGame: (wordLength: number) => void;
    buttonText?: string
};

export const SelectWordLength: React.FC<Props> = ({ className, wordLength, setWordLength, restartGame, buttonText }) => {
    return (
        <>
            <div className={cn(className, 'text-center')}>
                <div className='mb-4'>
                    <label htmlFor='wordLength' className='mr-2'>Word Length:</label>
                    <Input
                        id='wordLength'
                        type='number'
                        min='3'
                        max='15'
                        value={wordLength}
                        onChange={(e) => setWordLength(Number(e.target.value))}
                    />
                </div>
                <Button
                    size='lg'
                    variant='default'
                    onClick={() => restartGame(wordLength)}
                >
                    {buttonText ?? 'Start Game'}
                </Button>
            </div>
        </>
    );
};
