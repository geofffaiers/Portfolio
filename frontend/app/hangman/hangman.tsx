'use client';

import React from 'react';
import { useHangman } from './use-hangman';
import { Loader2 } from 'lucide-react';
import { SelectWordLength } from './select-word-length';
import { DisplayedWord } from './displayed-word';
import { Keyboard } from './keyboard';

export const Hangman: React.FC = () => {
    const {
        wordLength,
        setWordLength,
        word,
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
                    <div className="mb-4">{<DisplayedWord word={word} guessedLetters={guessedLetters} isGameLost={isGameLost}/>}</div>
                    {!isGameWon && !isGameLost && (
                        <Keyboard letters={letters} guessedLetters={guessedLetters} guessLetter={guessLetter} />
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
