'use client';

import React, { useState } from 'react';
import { useHangman } from './use-hangman';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceBreakpoints } from '@/hooks/use-device-breakpoints';
import { cn } from '@/lib/utils';

const qwertyLayout: readonly string[][] = Object.freeze([
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
]);

export const Hangman: React.FC = () => {
    const {
        wordLength,
        setWordLength,
        word,
        guessedLetters,
        loading,
        canvasRef,
        guessLetter,
        restartGame,
        isGameWon,
        isGameLost
    } = useHangman();

    const displayedWord = word.split('').map((letter, index) => (
        <span key={index} className="mx-1 text-2xl">
            {guessedLetters.includes(letter)
                ? letter.toUpperCase()
                : isGameLost
                    ? <span key={`incorrect-guess--${index}`} className='text-red-500'>{letter.toUpperCase()}</span>
                    : '_'
            }
        </span>
    ));

    return (
        <div className="w-full h-full flex flex-col items-center p-4 justify-start">
            {loading ? (
                <Loader2 className="animate-spin my-auto" />
            ) : !word ? (
                <SelectWordLength className='my-auto' wordLength={wordLength} setWordLength={setWordLength} restartGame={restartGame}/>
            ) : (
                <>
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className="mb-4"
                        style={{ backgroundColor: 'var(--background)' }}
                    />
                    <div className="mb-4">{displayedWord}</div>
                    {!isGameWon && !isGameLost && (
                        <Keyboard guessedLetters={guessedLetters} guessLetter={guessLetter} />
                    )}
                    {(isGameWon || isGameLost) && (
                        <SelectWordLength className="mt-4" wordLength={wordLength} setWordLength={setWordLength} restartGame={restartGame} buttonText='New Game'/>
                    )}
                    {isGameWon && (
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-8xl text-green-500 font-bold my-auto">
                            You won!
                        </h1>
                    )}
                    {isGameLost && (
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-8xl text-red-500 font-bold my-auto">
                            Game over!
                        </h1>
                    )}
                </>
            )}
        </div>
    );
};

interface WordLengthProps {
    className?: string;
    wordLength: number;
    setWordLength: (wordLength: number) => void;
    restartGame: (wordLength: number) => void;
    buttonText?: string
};

const SelectWordLength: React.FC<WordLengthProps> = ({ className, wordLength, setWordLength, restartGame, buttonText }) => {
    return (
        <>
            <div className={cn(className, 'text-center')}>
                <div className='mb-4'>
                    <label htmlFor="wordLength" className="mr-2">Word Length:</label>
                    <input
                        id="wordLength"
                        type="number"
                        min="3"
                        max="15"
                        value={wordLength}
                        onChange={(e) => setWordLength(Number(e.target.value))}
                        className="border p-1"
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

interface KeyboardProps {
    guessedLetters: string[];
    guessLetter: (letter: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ guessedLetters, guessLetter }) => {
    const { isMobile, isTablet } = useDeviceBreakpoints();
    return (
        <div className="mt-auto">
            {qwertyLayout.map((row, rowIndex) => {
                return (
                    <div
                        key={`row-index--${rowIndex}`}
                        className="text-center"
                    >
                        {row.map(letter => {
                            const guessed = guessedLetters.includes(letter);
                            return (
                                <Button
                                    variant={guessed ? 'ghost' : 'outline'}
                                    key={letter}
                                    onClick={() => guessLetter(letter)}
                                    disabled={guessed}
                                    className={cn(
                                        isMobile && 'w-8 h-8',
                                        isTablet && 'w-12 h-12',
                                        !isMobile && !isTablet && 'w-24 h-24',
                                        'me-2 mb-2'
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
