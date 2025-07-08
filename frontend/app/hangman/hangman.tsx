'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

import { Typography } from '@/components/ui/typography';
import { useHangman } from './use-hangman';
import { SelectWordLength } from './select-word-length';
import { DisplayedWord } from './displayed-word';
import { Keyboard } from './keyboard';
import { DefinitionDialog } from './definition-dialog/definition-dialog';

export const Hangman: React.FC = () => {
    const {
        wordLength,
        setWordLength,
        word,
        wordData,
        letters,
        guessedLetters,
        loading,
        canvasRef,
        guessLetter,
        restartGame,
        isGameWon,
        isGameLost
    } = useHangman();

    return (
        <div className='w-full h-full flex flex-col items-center p-4 justify-start'>
            {loading ? (
                <Loader2 className='animate-spin my-auto' />
            ) : !word ? (
                <SelectWordLength className='my-auto' wordLength={wordLength} setWordLength={setWordLength} restartGame={restartGame}/>
            ) : (
                <>
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className='mb-4'
                    />
                    <div className='mb-4'>{<DisplayedWord word={word} guessedLetters={guessedLetters} isGameLost={isGameLost}/>}</div>
                    {!isGameWon && !isGameLost && (
                        <Keyboard letters={letters} guessedLetters={guessedLetters} guessLetter={guessLetter} />
                    )}
                    {(isGameWon || isGameLost) && (
                        <>
                            <SelectWordLength className='my-4' wordLength={wordLength} setWordLength={setWordLength} restartGame={restartGame} buttonText='New Game'/>
                            {wordData && <DefinitionDialog wordData={wordData}/>}
                        </>
                    )}
                    {isGameWon && (
                        <Typography variant='h1' className='text-green-500 my-auto'>
                            You won!
                        </Typography>
                    )}
                    {isGameLost && (
                        <Typography variant='h1' className='text-red-500 my-auto'>
                            Game over!
                        </Typography>
                    )}
                </>
            )}
        </div>
    );
};
