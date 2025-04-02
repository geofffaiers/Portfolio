'use client';

import { useConfigContext } from '@/components/providers/config-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { DefaultResponse, WordData, WordWithData } from '@/models';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { KeyboardLayout } from './types';

interface UseHangman {
    wordLength: number;
    setWordLength: (length: number) => void;
    word: string;
    wordData: WordData | null;
    letters: KeyboardLayout;
    guessedLetters: string[];
    loading: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    guessLetter: (letter: string) => void;
    restartGame: (wordLength: number) => void;
    isGameWon: boolean;
    isGameLost: boolean;
    maxWrong: number;
}

export function useHangman(): UseHangman {
    const { config } = useConfigContext();
    const { displayError } = useToastWrapper();
    const [wordLength, setWordLength] = useState<number>(5);
    const [word, setWord] = useState<string>('');
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [letters, setLetters] = useState<KeyboardLayout>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const maxWrong = 6;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keyListenerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

    const correctLetters = useMemo(() => letters.flat().filter((l) => l.correct).map((l) => l.letter), [letters]);
    const wrongLetters = useMemo(() => letters.flat().filter((l) => l.guessed && !l.correct).map((l) => l.letter), [letters]);
    const guessedLetters = useMemo(() => [...correctLetters, ...wrongLetters], [correctLetters, wrongLetters]);

    const resetLetters = useCallback(() => {
        const l = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm']
        ];
        const newLetters = l.map((row) => row.map((letter) => ({ letter, guessed: false, correct: false })));
        setLetters(newLetters);
    }, []);

    const restartGame = useCallback(async (wordLength: number) => {
        setLoading(true);
        resetLetters();
        try {
            const response = await fetch(`${config.apiUrl}/hangman/word?length=${wordLength}`);
            const json: DefaultResponse<WordWithData> = await response.json();
            if (json.success && json.data.word) {
                setWord(json.data.word.toLowerCase());
                if (Array.isArray(json.data.data) && json.data.data.length > 0) {
                    setWordData(json.data.data[0]);
                } else {
                    setWordData(null);
                }
            } else {
                setWord('');
                setWordData(null);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                displayError(err.message);
            } else {
                displayError('An unknown error occurred');
            }
            setWord('');
            setWordData(null);
        }
        setLoading(false);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
    }, [config.apiUrl, resetLetters, displayError]);

    const guessLetter = useCallback((letter: string) => {
        letter = letter.toLowerCase();
        if (guessedLetters.includes(letter) || wrongLetters.length > wordLength) return;
        setLetters((prevLetters) => {
            return prevLetters.map((row) =>
                row.map((l) => {
                    if (l.guessed || l.letter !== letter) return l;
                    return {
                        letter,
                        guessed: true,
                        correct: word.includes(letter)
                    };
                })
            );
        });
    }, [word, guessedLetters, wrongLetters, wordLength]);

    useEffect(() => {
        if (keyListenerRef.current) {
            window.removeEventListener('keydown', keyListenerRef.current);
        }

        const handleKeydown = (e: KeyboardEvent) => {
            const letter = e.key;
            if (/^[a-zA-Z]$/.test(letter)) {
                e.preventDefault();
                guessLetter(letter.toLowerCase());
            }
        };

        keyListenerRef.current = handleKeydown;
        window.addEventListener('keydown', handleKeydown);

        return () => {
            if (keyListenerRef.current) {
                window.removeEventListener('keydown', keyListenerRef.current);
            }
        };
    }, [guessLetter]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const computedStyles = getComputedStyle(canvas);
        const foregroundValue = computedStyles.getPropertyValue('--foreground')?.trim() || '0, 0%, 0%';
        const backgroundValue = computedStyles.getPropertyValue('--background')?.trim() || '0, 0%, 100%';
        const foregroundColor = `hsl(${foregroundValue})`;
        const backgroundColor = `hsl(${backgroundValue})`;

        // Fill the canvas with the background color.
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = foregroundColor;
        ctx.lineWidth = 4;

        // Draw gallows:
        // Base line:
        ctx.beginPath();
        ctx.moveTo(10, canvas.height - 10);
        ctx.lineTo(canvas.width - 10, canvas.height - 10);
        ctx.stroke();

        // Vertical pole:
        ctx.beginPath();
        ctx.moveTo(30, canvas.height - 10);
        ctx.lineTo(30, 10);
        ctx.stroke();

        // Horizontal beam:
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(canvas.width / 2, 10);
        ctx.stroke();

        // Rope:
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 10);
        ctx.lineTo(canvas.width / 2, 30);
        ctx.stroke();

        // Draw hangman parts based on wrong letters:
        const wrongCount = wrongLetters.length;
        // Head:
        if (wrongCount > 0) {
            ctx.beginPath();
            ctx.arc(canvas.width / 2, 45, 15, 0, Math.PI * 2);
            ctx.stroke();
        }
        // Body:
        if (wrongCount > 1) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 60);
            ctx.lineTo(canvas.width / 2, 100);
            ctx.stroke();
        }
        // Left arm:
        if (wrongCount > 2) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 70);
            ctx.lineTo(canvas.width / 2 - 20, 85);
            ctx.stroke();
        }
        // Right arm:
        if (wrongCount > 3) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 70);
            ctx.lineTo(canvas.width / 2 + 20, 85);
            ctx.stroke();
        }
        // Left leg:
        if (wrongCount > 4) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 100);
            ctx.lineTo(canvas.width / 2 - 20, 125);
            ctx.stroke();
        }
        // Right leg:
        if (wrongCount > 5) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 100);
            ctx.lineTo(canvas.width / 2 + 20, 125);
            ctx.stroke();
        }
    }, [wrongLetters]);

    const isGameWon = word.length > 0 && word.split('').every((letter) => correctLetters.find((l) => l === letter));
    const isGameLost = wrongLetters.length >= maxWrong;

    return {
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
        isGameLost,
        maxWrong
    };
}
